import { useEffect, useState } from "react";
import { MQTTConnect, MQTTSubscribe } from "../../../services/mqtt_service";
import { MqttDataContext } from "./MqttContext";

export function MqttProvider({ topics = [], children }) {
  const [mqttData, setMqttData] = useState({}); // { topic1: payload1, topic2: payload2 }

  useEffect(() => {
    let subscribes = [];

    async function initial() {
      await MQTTConnect();

      for (const topic of topics) {
        const unsubscribe = await MQTTSubscribe(topic, (payload) => {
          // console.log(payload);
          setMqttData((prev) => ({ ...prev, [topic]: payload }));
        });
        subscribes.push(unsubscribe);
      }
    }

    initial();

    return () => { subscribes.forEach((unsub) => unsub?.()); };
  }, [topics.join(",")]);

  return (
    <MqttDataContext.Provider value={mqttData}>
      {children}
    </MqttDataContext.Provider>
  );
}
