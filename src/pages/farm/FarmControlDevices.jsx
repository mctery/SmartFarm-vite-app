import { useEffect, useState } from "react";
import { Button, Container, Divider, Grid, Typography } from "@mui/material";
import { useSnackbar } from 'notistack';
import { Outlet } from "react-router-dom";
import {
  SysGetDevices,
  SysCreateDevice,
  SysUpdateDevice,
  SysDeleteDevice,
  getUserInfo
} from "../../services/global_function";
import DeviceWidget from "../../components/DeviceWidget";
import DeviceFormDialog from "../../components/DeviceFormDialog";
import DialogGridStack from "../../components/GridStack/DialogGridStack";

export default function FarmControlDevices() {
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
    console.log("Fetched devices:", data);
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
      const success = await SysDeleteDevice(device._id);
      if (success) {
        enqueueSnackbar("ลบอุปกรณ์แล้ว", { variant: "success" });
        setDevices((prev) => prev.filter((d) => d._id !== device._id));
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

    console.log(payload);

    if (currentDevice) {
      const updated = await SysUpdateDevice(currentDevice._id, payload);
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
      <Typography variant="h4" sx={{ mb: 2 }}>ระบบควบคุมฟาร์ม</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openAddDialog}>เพิ่มอุปกรณ์</Button>

      {loading ? (
        <Typography>กำลังโหลดข้อมูล...</Typography>
      ) : (
        <Grid container spacing={2}>
          {devices.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <DeviceWidget
                device={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {/* <Divider sx={{ my: 2 }} /> */}
              {/* <Button variant="outlined" size="small" onClick={() => navigate(`gridstack/${item._id}`)}>GridStack</Button> */}
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
      <Outlet />
    </Container>
  );
}
