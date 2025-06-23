import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { STYLES } from "../service/global_variable";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  Divider,
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

export default function DeviceFormDialog({
  open,
  onClose,
  onSubmit,
  initialData = {},
  variant = "dialog",
  currentUserId // ← 👈 optional, you can inject user_id here
}) {
  const [formData, setFormData] = useState({
    device_id: "",
    image: "",
    name: "",
    status: false,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData({
      device_id: initialData.device_id || "",
      image: initialData.image || "",
      name: initialData.name || "",
      status: initialData.status === "A", // ← 👈 convert string to boolean
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      status: formData.status ? "A" : "D", // 👈 convert boolean to string
    };

    // inject user_id if needed
    if (!initialData.device_id && currentUserId) {
      payload.user_id = currentUserId.toString();
    }

    onSubmit(payload);
  };

  const formFields = (
    <>
      <TextField size="small" margin="dense" label="Device ID" name="device_id" value={formData.device_id} onChange={handleChange} fullWidth disabled={!!initialData.device_id}/>
      <TextField size="small" margin="dense" label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth/>
      <FormControlLabel sx={{ width: '100%', mt: 1, mb: 1 }} control={ <Switch size="small" name="status" checked={formData.status} onChange={handleChange} color="primary"/> } label="เปิดใช้งาน"/>
      <Divider/>
      <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 1 }}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <Button size="small" startIcon={<AddAPhotoIcon />} onClick={triggerFileSelect}>อัพโหลดรูปภาพอุปกรณ์</Button>
        <Box sx={{ overflow: 'hidden', width: 200, height: 200, borderRadius: STYLES.borderRadius }}>
          {
            formData.image ?
              <img src={formData.image} width={200} height={200} alt="อุปกรณ์"/>
              :
              <img src="./no_image.jpg" width={200} height={200} alt="no_image"/>
          }
        </Box>
      </Stack>
    </>
  );

  const actions = (
    <Box sx={{ textAlign: "right", mt: 2 }}>
      <Button size="small" onClick={onClose} sx={{ mr: 1 }} color="error">ยกเลิก</Button>
      <Button size="small" onClick={handleSubmit} variant="contained" color="success">บันทึก</Button>
    </Box>
  );

  if (variant === "drawer") {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 350, p: 2, paddingTop: 10 }} role="presentation">
          <Typography variant="h6" gutterBottom>{initialData.device_id ? "แก้ไข" : "เพิ่ม"}อุปกรณ์</Typography>
          {formFields}
          <Divider/>
          {actions}
        </Box>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData.device_id ? "แก้ไข" : "เพิ่ม"}อุปกรณ์
      </DialogTitle>
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
  variant: PropTypes.oneOf(["dialog", "drawer"]),
  currentUserId: PropTypes.string, // 👈 new
};