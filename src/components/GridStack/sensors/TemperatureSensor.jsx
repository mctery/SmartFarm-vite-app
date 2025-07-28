import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WidgetBoxLoading from "../WidgetBoxLoading";
import { MQTTConnect, MQTTSubscribe } from "../../../services/mqtt_service";
import { MqttDataContext } from '../context/MqttContext';

// mqtt {"d":"44c44e9ef0c8","t":"temperature","v":{"1":27,"2":33,"3":37,"4":28,"5":37,"6":31,"7":34,"8":37}}

export default function TemperatureSensor({ deviceId, widget }) {
  const mqttData = useContext(MqttDataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [currentValue, setCurrentValue] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    const topic = `device/${deviceId}/temperature`;
    const key = widget?.sensorKey;
    const payload = mqttData[topic];

    console.log("📡 mqttData:", mqttData);
    console.log("📡 mqttData:", mqttData[topic]);
    // console.log("🔍 topic:", `device/${deviceId}/temperature`);

    if (payload?.v?.[key] !== undefined) {
      setCurrentValue(payload.v[key].v);

      setIsLoading(false);
    }
  }, [mqttData, deviceId, widget]);


  if (isLoading) {
    return <WidgetBoxLoading />;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 1, }}>
      <DeviceThermostatIcon fontSize="small" color="error" />
      <Stack direction={'column'} spacing={1}>
        <Typography variant="body2">{deviceId ?? "-"}</Typography>
        <Typography variant="body2">{widget?.title ?? "-"}</Typography>
        <Typography variant="body2">{widget?.sensorKey ?? "-"}</Typography>
        <Typography variant="body2">{currentValue ?? "-"}</Typography>
      </Stack>
    </Box>
  );
}

TemperatureSensor.propTypes = {
  deviceId: PropTypes.string,
  widget: PropTypes.shape({
    title: PropTypes.string,
    sensorKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};
