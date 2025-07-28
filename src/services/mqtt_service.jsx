import mqtt from "mqtt";

const HOST = import.meta.env.VITE_MQTT_HOST;
let client = null;

// 💡 ใช้ Map เก็บ handler ตาม topic
const topicListeners = new Map();

export function MQTTConnect() {
  return new Promise((resolve, reject) => {
    if (client && client.connected) return resolve(client);

    client = mqtt.connect(HOST);

    client.on("connect", () => {
      // console.log("MQTT Connected");
      resolve(client);
    });

    client.on("error", (err) => {
      console.error("MQTT Connection Error:", err);
      reject(err);
    });

    // ✅ มีเพียงตัวเดียวเท่านั้น
    client.on("message", (topic, message) => {
      const handler = topicListeners.get(topic);
      if (handler && typeof handler === "function") {
        try {
          const payload = JSON.parse(message.toString());
          handler(payload);
        } catch (_err) {
          console.error('Invalid JSON from MQTT:', _err);
        }
      }
    });
  });
}

export function MQTTDisconnect() {
  return new Promise((resolve) => {
    if (client) {
      client.end(true, () => {
        topicListeners.clear(); // ✅ เคลียร์ handler
        resolve(true);
      });
    } else {
      resolve(true);
    }
  });
}

export function MQTTSubscribe(topic, onMessage) {
  return new Promise((resolve, reject) => {
    if (!client) return reject("MQTT client not connected");

    client.subscribe(topic, (err) => {
      if (!err) {
        topicListeners.set(topic, onMessage); // ✅ เก็บ handler ลง map

        // ✅ คืน function ยกเลิก
        const unsubscribe = () => {
          client.unsubscribe(topic);
          topicListeners.delete(topic); // ✅ ลบ handler ออก
        };

        resolve(unsubscribe);
      } else {
        reject(err);
      }
    });

    // client.on("message", (topic, message) => {
    //   const handler = topicListeners.get(topic);
    //   if (handler) {
    //     try {
    //       const payload = JSON.parse(message.toString());
    //       // console.log("💬 MQTT PAYLOAD:", topic, payload);  // ✅ debug เพิ่ม
    //       handler(payload);
    //     } catch (err) {
    //       console.error("❌ MQTT JSON Parse Error:", err);
    //     }
    //   }
    // });

  });
}
