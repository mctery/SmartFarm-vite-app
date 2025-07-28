import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ICON } from "../../services/global_variable";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Stack,
  Tooltip,
  Divider,
  useTheme,
} from "@mui/material";
import BoxLoading from "../BoxLoading";

// Sensors
import HumiditySensor from "./sensors/HumiditySensor";
import TemperatureSensor from "./sensors/TemperatureSensor";
import LightSensor from "./sensors/LightSensor";

// Wather Live
import WidgetLiveWather from "./WidgetLiveWather";

export function GridStackWidgetCore({ deviceId, widget, onEdit, onDelete }) {
  // const [deviceIdRef, setDeviceIdRef] = useState(null);
  const [widgetRef, setWidgetRef] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showButtons, setShowButtons] = useState(false);

  const containerRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    initial();
  }, []);

  function initial() {
    try {
      setIsLoading(true);
      // setDeviceIdRef(deviceId);
      setWidgetRef(widget);
    } catch (error) {
      console.error("error initial:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditWidget = () => onEdit(widgetRef.id);
  const handleRemoveWidget = () => onDelete(widgetRef.id);

  const getWidgetCore = () => {
    switch (widgetRef.type) {
      case "temperature":
        return <TemperatureSensor deviceId={deviceId} widget={widget} />;
      case "humidity":
        return <HumiditySensor />;
      case "light":
        return <LightSensor />;
      case "watherlive":
        return <WidgetLiveWather city="Bangkok" containerRef={containerRef} />;
      default:
        return false;
    }
  };

  if (isLoading) {
    return <BoxLoading />;
  }

  return (
    <Paper
        ref={containerRef} // ✅ ใช้กับ ResizeObserver ด้านใน
        elevation={3}
        sx={{
          p: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          borderRadius: 3,
        }}
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            borderRadius: 3,
            opacity: showButtons ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : theme.palette.grey[300],
          }}
        >
          <Tooltip title="แก้ไขวิดเจ็ต">
            <IconButton
              size="small"
              onClick={handleEditWidget}
              color={ICON.EDIT.color}
            >
              {ICON.EDIT.icon}
            </IconButton>
          </Tooltip>
          <Tooltip title="ลบวิดเจ็ต">
            <IconButton
              size="small"
              onClick={handleRemoveWidget}
              color={ICON.REMOVE.color}
            >
              {ICON.REMOVE.icon}
            </IconButton>
          </Tooltip>
        </Stack>

        {/* เนื้อหา widget */}
        {/* <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>{deviceIdRef}</Typography>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>{widgetRef.title}</Typography> */}
        {getWidgetCore()}
      </Paper>
  );
}
