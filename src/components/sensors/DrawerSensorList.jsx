// src/components/SensorDrawer.js
import React from "react";
import {
  Box,
  Drawer,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import GroupWorkIcon from "@mui/icons-material/GroupWork";
import ThermostatIcon from "@mui/icons-material/Thermostat";

/**
 * Drawer แสดงรายการ Sensor สำหรับเพิ่มลงใน Widget
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   sensors: { sensor_id: string, sensor_type: string }[],
 *   onAddSensor: (sensor: any) => void,
 *   onAddSensorGroup: () => void,
 * }} props
 */
export default function SensorDrawer({
  open,
  onClose,
  sensors = [],
  onAddSensor,
  onAddSensorGroup,
}) {
  const handleSelectSensor = (sensor) => {
    onAddSensor(sensor);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2, pt: 10 }} role="presentation">
        <Typography variant="h6" sx={{ mb: 2 }}>
          เพิ่มเซนเซอร์ลงใน Widget
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GroupWorkIcon />}
          onClick={() => {
            onAddSensorGroup();
            onClose();
          }}
          sx={{ mb: 2 }}
        >
          เพิ่มทั้งหมดเป็นกลุ่ม
        </Button>

        <Divider sx={{ mb: 1 }} />

        <List>
          {sensors.length > 0 ? (
            sensors.map((sensor, index) => (
              <ListItem
                key={`sensor-${index}`}
                button
                sx={{ cursor: "pointer" }}
                onClick={() => handleSelectSensor(sensor)}
              >
                <ListItemIcon>
                  <ThermostatIcon />
                </ListItemIcon>
                <ListItemText
                  primary={sensor.sensor_type}
                  secondary={`Sensor ID: ${sensor.sensor_id}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>
              ไม่พบเซนเซอร์ที่เชื่อมต่อ
            </Typography>
          )}
        </List>
      </Box>
    </Drawer>
  );
}
