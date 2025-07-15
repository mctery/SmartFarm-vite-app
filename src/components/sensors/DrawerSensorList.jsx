import React, { useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import GroupWorkIcon from "@mui/icons-material/GroupWork";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import LeakAddTwoToneIcon from "@mui/icons-material/LeakAddTwoTone";

import { SysCreateDevice, SysUpdateDeviceSensors, SysDeleteDevice } from "../../services/sensor_service";
import { getUserInfo } from "../../services/storage_service";

const CURRENT_USER_ID = getUserInfo().user_id;

export default function DrawerSensorList({
  open,
  onClose,
  sensors = [],
  onAddSensor,
  onAddSensorGroup,
  onUpdateSensor,
  onDeleteSensor,
  deviceId,
}) {
  const [openForm, setOpenForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null); // _id ของ sensor ที่จะแก้ไข
  const [formData, setFormData] = useState({
    sensor_type: "",
    sensor_id: "",
    unit: "",
    user_id: CURRENT_USER_ID,
    status: true
  });
  const [loading, setLoading] = useState(false);

  const capitalizeFirstLetter = (val) =>
    String(val).charAt(0).toUpperCase() + String(val).slice(1);

  const openAddSensorForm = () => {
    setFormData({ sensor_type: "", sensor_id: "", unit: "", status: true });
    setIsEditMode(false);
    setEditId(null);
    handleDialogOpen();
  };

  const handleEditSensor = (sensor) => {
    setFormData({
      sensor_type: sensor.sensor_type,
      sensor_id: sensor.sensor_id,
      unit: sensor.unit || "",
      status: sensor.status || true
    });
    setEditId(sensor._id); // ต้องแน่ใจว่า sensor มี _id
    setIsEditMode(true);
    handleDialogOpen();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        device_id: deviceId,
        ...formData,
        updated_at: new Date().toISOString()
      };

      let res;
      if (isEditMode && editId) {
        res = await SysUpdateDeviceSensors(editId, payload);
      } else {
        payload.time = new Date().toISOString();
        res = await SysCreateDevice(payload);
      }

      if (res) {
        const result = res;
        if (isEditMode) {
          onUpdateSensor(result);
        } else {
          onAddSensor(result);
        }
      }
      
    } catch (err) {
      console.error("Sensor save error:", err);
    } finally {
      setLoading(false);
      handleDialogClose();

      setOpenForm(false);
      setFormData({ sensor_type: "", sensor_id: "", unit: "", status: true });
      setEditId(null);
      setIsEditMode(false);
    }
  };

  const handleDelete = async () => {
    if (!editId) return;

    const confirm = window.confirm("คุณต้องการลบเซนเซอร์นี้หรือไม่?");
    if (!confirm) return;

    try {
      setLoading(true);
      await SysDeleteDevice(editId);
      onDeleteSensor({ _id: editId });
    } catch (err) {
      console.error("ลบ sensor ไม่สำเร็จ:", err);
    } finally {
      setLoading(false);
      handleDialogClose();

      // หลังลบสำเร็จ:
      setFormData({ sensor_type: "", sensor_id: "", unit: "" });
      setEditId(null);
      setIsEditMode(false);
    }
  };

  const handleDialogOpen = () => { setOpenForm(true) };
  const handleDialogClose = () => { setOpenForm(false) };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 1000, p: 2, pt: 10 }} role="presentation">
        <Typography variant="h6" sx={{ mb: 2 }}>เพิ่มวิดเจ็ตเซนเซอร์</Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LeakAddTwoToneIcon />}
            onClick={openAddSensorForm}
          >
            เพิ่มเซนเซอร์
          </Button>
          <Button
            variant="outlined"
            color="info"
            fullWidth
            startIcon={<GroupWorkIcon />}
            onClick={() => {
              onAddSensorGroup();
              onClose();
            }}
          >
            เพิ่มวิดเจ็ตเซนเซอร์เป็นกลุ่ม
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <List>
          {sensors.length > 0 ? (
            sensors.map((sensor, index) => (
              <ListItem
                key={`sensor-${index}`}
                button="true"
                sx={{ cursor: "pointer" }}
                onClick={() => handleEditSensor(sensor)}
              >
                <ListItemIcon>
                  <ThermostatIcon />
                </ListItemIcon>
                <ListItemText
                  primary={capitalizeFirstLetter(sensor.sensor_type)}
                  secondary={`Sensor ID: ${sensor.sensor_id}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>ไม่พบเซนเซอร์ที่เชื่อมต่อ</Typography>
          )}
        </List>
      </Box>

      {/* 🔽 Dialog ฟอร์มเพิ่ม/แก้ไข Sensor */}
      <Dialog open={openForm} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? "แก้ไขเซนเซอร์" : "เพิ่มเซนเซอร์ใหม่"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Sensor Type"
            size="small"
            fullWidth
            margin="normal"
            value={formData.sensor_type}
            onChange={(e) => setFormData((prev) => ({ ...prev, sensor_type: e.target.value })) }
          />
          <TextField
            label="Sensor ID"
            size="small"
            fullWidth
            margin="normal"
            value={formData.sensor_id}
            onChange={(e) => setFormData((prev) => ({ ...prev, sensor_id: e.target.value })) }
          />
          <TextField
            label="หน่วย (°C, %, lux)"
            size="small"
            fullWidth
            margin="normal"
            value={formData.unit}
            onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value })) }
          />

          <Divider sx={{ my: 1 }} />
          <Stack direction="row" spacing={2} justifyContent={'space-between'}>
            {isEditMode && (
              <Button
                onClick={handleDelete}
                color="error"
                variant="outlined"
                disabled={loading}
              >
                ลบเซนเซอร์
              </Button>
            )}
            <Stack direction="row" spacing={2}>
              <Button onClick={handleDialogClose}>ยกเลิก</Button>
              <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                {loading ? "กำลังบันทึก..." : isEditMode ? "อัปเดต" : "บันทึก"}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Drawer>
  );
}
