import { useState, useEffect, useContext } from "react";
import { MqttDataContext } from "../../context/MqttContext";

export default function useSensorValue(topic, key) {
  const mqtt   = useContext(MqttDataContext);
  const [val , setVal ] = useState(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const payload = mqtt[topic];
    if (payload?.v?.[key] !== undefined) {
      setVal(payload.v[key]);
      setLoad(false);
    }
  }, [mqtt, topic, key]);

  return [val, load];
}
