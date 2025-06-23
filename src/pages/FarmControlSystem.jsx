import { useEffect, useState } from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import { useSnackbar } from 'notistack';
import {
  SysGetDevices,
  SysCreateDevice,
  SysUpdateDevice,
  SysDeleteDevice,
  getUserInfo
} from "../service/global_function";
import DeviceWidget from "../components/DeviceWidget";
import DeviceFormDialog from "../components/DeviceFormDialog";

export default function FarmControlSystem() {
  const [devices, setDevices] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);

  const CURRENT_USER_ID = getUserInfo().user_id;

  const fetchDevices = async () => {
    setLoading(true);
    const data = await SysGetDevices();
    if (Array.isArray(data)) {
      setDevices(data);
    } else {
      enqueueSnackbar('ไม่พบข้อมูลอุปกรณ์', { variant: 'warning' });
      setDevices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const openAddDialog = () => {
    setCurrentDevice(null);
    setAddOpen(true);
  };

  const handleEdit = (device) => {
    setCurrentDevice(device);
    setEditOpen(true);
  };

  const handleDelete = async (device) => {
    if (window.confirm("ต้องการลบอุปกรณ์นี้หรือไม่?")) {
      const success = await SysDeleteDevice(device.device_id);
      if (success) {
        enqueueSnackbar("ลบอุปกรณ์แล้ว", { variant: "success" });
        setDevices((prev) => prev.filter((d) => d.device_id !== device.device_id));
      } else {
        enqueueSnackbar("ลบอุปกรณ์ไม่สำเร็จ", { variant: "error" });
      }
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      user_id: CURRENT_USER_ID,
    };

    if (currentDevice) {
      const updated = await SysUpdateDevice(currentDevice.device_id, payload);
      if (updated) {
        enqueueSnackbar("แก้ไขอุปกรณ์แล้ว", { variant: "success" });
        setDevices((prev) =>
          prev.map((d) =>
            d.device_id === currentDevice.device_id ? updated : d
          )
        );
      } else {
        enqueueSnackbar("แก้ไขอุปกรณ์ไม่สำเร็จ", { variant: "error" });
      }
    } else {
      const created = await SysCreateDevice(payload);
      if (created) {
        enqueueSnackbar("เพิ่มอุปกรณ์แล้ว", { variant: "success" });
        setDevices((prev) => [...prev, created]);
      } else {
        enqueueSnackbar("เพิ่มอุปกรณ์ไม่สำเร็จ", { variant: "error" });
      }
    }

    setAddOpen(false);
    setEditOpen(false);
    setCurrentDevice(null);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        ระบบควบคุมฟาร์ม
      </Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openAddDialog}>
        เพิ่มอุปกรณ์
      </Button>

      {loading ? (
        <Typography>กำลังโหลดข้อมูล...</Typography>
      ) : (
        <Grid container spacing={2}>
          {devices.map((device) => (
            <Grid item size={4} key={device.device_id}>
              <DeviceWidget
                device={device}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <DeviceFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleSubmit}
        initialData={{}}
        currentUserId={CURRENT_USER_ID}
      />

      <DeviceFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleSubmit}
        initialData={currentDevice || {}}
        variant="drawer"
        currentUserId={CURRENT_USER_ID}
      />
    </Container>
  );
}
