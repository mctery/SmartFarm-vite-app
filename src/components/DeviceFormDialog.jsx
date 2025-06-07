import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";

export default function DeviceFormDialog({
  open,
  onClose,
  onSubmit,
  initialData = {},
  variant = "dialog",
}) {
  const [formData, setFormData] = useState({
    device_id: "",
    name: "",
    status: false,
  });

  useEffect(() => {
    setFormData({
      device_id: initialData.device_id || "",
      name: initialData.name || "",
      status:
        typeof initialData.status === "boolean" ? initialData.status : false,
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const formFields = (
    <>
      <TextField
        margin="dense"
        label="Device ID"
        name="device_id"
        value={formData.device_id}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        margin="dense"
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
      />
      <FormControlLabel
        control={
          <Switch
            name="status"
            checked={formData.status}
            onChange={handleChange}
            color="primary"
          />
        }
        label="เปิดใช้งาน"
      />
    </>
  );

  const actions = (
    <Box sx={{ textAlign: 'right', mt: 2 }}>
      <Button onClick={onClose} sx={{ mr: 1 }}>ยกเลิก</Button>
      <Button onClick={handleSubmit} variant="contained">
        บันทึก
      </Button>
    </Box>
  );

  if (variant === 'drawer') {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 320, p: 2 }} role="presentation">
          <Typography variant="h6" gutterBottom>
            {initialData.device_id ? 'แก้ไข' : 'เพิ่ม'}อุปกรณ์
          </Typography>
          {formFields}
          {actions}
        </Box>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData.device_id ? 'แก้ไข' : 'เพิ่ม'}อุปกรณ์</DialogTitle>
      <DialogContent>{formFields}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
}

DeviceFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  variant: PropTypes.oneOf(['dialog', 'drawer']),
};
