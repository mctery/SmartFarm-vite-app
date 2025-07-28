import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Typography,
  useTheme,
  Paper,
  Divider,
} from "@mui/material";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { SENSORS_TYPE } from "../../../services/global_variable";

import WidgetBoxLoading from "../WidgetBoxLoading";
import { MqttDataContext } from '../context/MqttContext';

export default function TemperatureSensor({ deviceId, widget }) {
  const mqttData = useContext(MqttDataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [currentValue, setCurrentValue] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    const topic = `device/${deviceId}/temperature`;
    const topic_OFFLINE = `device/${deviceId}/will`;

    const key = widget?.sensorKey;
    const payload = mqttData[topic];

    console.log(mqttData[topic]);
    // console.log(mqttData[topic_OFFLINE]?.status);

    if (payload?.v?.[key] !== undefined) {
      setCurrentValue(payload?.v?.[key]);
      setIsLoading(false);
    }

    // if(mqttData[topic_OFFLINE]?.status === 'offline') {
    //   setCurrentValue('OFFLINE');
    //   setIsLoading(false);
    // }
  }, [mqttData]);

  if (isLoading) {
    return <WidgetBoxLoading />;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#1976d2",
        color: "#fff",
        height: "100%",
        borderRadius: 2,
        p: 1.5,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 1.2,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {SENSORS_TYPE.temperature.icon}
          <Typography variant="body2">{widget?.title || "Sensor"}</Typography>
        </Stack>
      </Box>

      {/* Center: Icon & Temperature */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
        <DeviceThermostatIcon sx={{ fontSize: 50 }} />
        <Typography variant="h3" sx={{ fontWeight: 600 }}>{currentValue}°</Typography>
      </Box>

      {/* Footer: Info */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.3)", my: 1 }} />
      <Typography variant="body2" sx={{ opacity: 0.8 }}>Device: {deviceId ?? "-"} | Sensor: {widget?.sensorKey ?? "-"}</Typography>
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
