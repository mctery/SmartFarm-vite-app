import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { STYLES } from "../services/global_variable";
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
  Tooltip,
} from "@mui/material";
import imageCompression from "browser-image-compression";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import NoImage from "../assets/no_image.jpg";

export default function DeviceFormDialog({
  open,
  onClose,
  onSubmit,
  initialData = {},
  variant = "dialog",
  currentUserId,
}) {
  const [formData, setFormData] = useState({
    device_id: "",
    name: "",
    image: "",
    version: "1.0",
    // online_status: false,
    status: false,
    user_id: currentUserId || "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData({
      device_id: initialData.device_id || "",
      name: initialData.name || "",
      version: initialData.version || "",
      // online_status: initialData.online_status || "",
      image: initialData.image || "",
      status: initialData.status === "A",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      // ตัวเลือกการบีบอัด
      const options = {
        maxSizeMB: 0.2, // ขนาดไม่เกิน 0.5 MB
        maxWidthOrHeight: 720, // ขนาดภาพไม่เกิน 1024px
        useWebWorker: true, // ใช้ web worker เพื่อไม่บล็อค UI
      };

      const compressedFile = await imageCompression(file, options);
      console.log("ก่อนบีบ:", file.size / 1024, "KB");
      console.log("หลังบีบ:", compressedFile.size / 1024, "KB");

      // อ่านเป็น Base64 สำหรับ preview หรืออัปโหลด
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดขณะ compress รูป:", error);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  const triggerFileRemove = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = () => {
    const payload = { ...formData, status: formData.status ? "A" : "D" };

    if (!initialData.device_id && currentUserId) {
      payload.user_id = currentUserId.toString();
    }

    onSubmit(payload);
  };

  const formFields = (
    <>
      <TextField
        size="small"
        margin="dense"
        label="รหัสอุปกรณ์"
        name="device_id"
        value={formData.device_id}
        onChange={handleChange}
        fullWidth
        disabled={!!initialData.device_id}
      />
      <TextField
        size="small"
        margin="dense"
        label="ชื่ออุปกรณ์"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        size="small"
        margin="dense"
        label="เวอร์ชัน"
        name="version"
        value={formData.version}
        onChange={handleChange}
        fullWidth
      />
      {/* <FormControlLabel sx={{ width: '100%', mt: 1, mb: 1 }} control={ <Switch size="small" name="online_status" checked={formData.online_status} onChange={handleChange} color="primary"/> } label="เปิดใช้งาน"/> */}
      {/* <FormControlLabel
        sx={{ width: "100%", mt: 1, mb: 1 }}
        control={
          <Switch
            size="small"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            color="primary"
          />
        }
        label="เปิดใช้งานอุปกรณ์"
      /> */}

      <Divider sx={{ mt: 1 }}/>
      <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 1 }}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        {
          !formData.image ? (
            <Button
              size="small"
              startIcon={<AddAPhotoIcon />}
              onClick={triggerFileSelect}
            >
              เลือกรูปภาพอุปกรณ์
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={triggerFileRemove}
            >
              ลบรูปภาพอุปกรณ์
            </Button>
          )
        }
        <Box
          sx={{
            overflow: "hidden",
            width: 200,
            height: 200,
            borderRadius: STYLES.borderRadius,
          }}
        >
          {formData.image ? (
            <img src={formData.image} width={200} height={200} alt="อุปกรณ์" />
          ) : (
            <img src={NoImage} width={200} height={200} alt="no_image" />
          )}
        </Box>
      </Stack>
    </>
  );

  const actions = (
    <Box sx={{ textAlign: "right", mt: 2 }}>
      <Tooltip title="ยกเลิกการแก้ไข">
        <Button size="small" onClick={onClose} sx={{ mr: 1 }} color="error">
          ยกเลิก
        </Button>
      </Tooltip>
      <Tooltip title="บันทึกข้อมูล">
        <Button
          size="small"
          onClick={handleSubmit}
          variant="contained"
          color="success"
        >
          บันทึก
        </Button>
      </Tooltip>
    </Box>
  );

  if (variant === "drawer") {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 350, p: 2, paddingTop: 10 }} role="presentation">
          <Typography variant="h6" gutterBottom>
            {initialData.device_id ? "ตั้งค่า" : "เพิ่ม"}อุปกรณ์
          </Typography>
          {formFields}
          <Divider />
          {actions}
        </Box>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData.device_id ? "ตั้งค่า" : "เพิ่ม"}อุปกรณ์</DialogTitle>
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
