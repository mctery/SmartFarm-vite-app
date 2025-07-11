import { useEffect, useState } from "react";
import { Button, Container, Divider, Grid, Typography, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import { Outlet } from "react-router-dom";
import {
  SysGetDevices,
  SysCreateDevice,
  SysUpdateDevice,
  SysDeleteDevice,
  getUserInfo,
} from "../../services/global_function";
import DeviceWidget from "../../components/DeviceWidget";
import DeviceFormDialog from "../../components/DeviceFormDialog";
import DialogGridStack from "../../components/GridStack/DialogGridStack";
import BoxLoading from "../../components/BoxLoading";

import { animated, useSprings } from '@react-spring/web';
import { MQTTConnect } from "../../services/mqtt_service";

export default function FarmControlDevices() {
  const [devices, setDevices] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);

  const CURRENT_USER_ID = getUserInfo().user_id;

  const fetchDevices = async () => {
    await MQTTConnect();
    setLoading(true);
    const data = await SysGetDevices();
    console.log(data);
    if (Array.isArray(data)) {
      setDevices(data);
    } else {
      enqueueSnackbar("ไม่พบอุปกรณ์ในระบบ", { variant: "warning" });
      setDevices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // ✅ สร้าง animation สำหรับแต่ละ device
  const springs = useSprings(
    devices.length,
    devices.map((_, i) => ({
      from: { opacity: 0, transform: "translateY(20px)" },
      to: { opacity: 1, transform: "translateY(0)" },
      delay: i * 100,
    }))
  );

  const openAddDialog = () => {
    setCurrentDevice(null);
    setAddOpen(true);
  };

  const handleEdit = (device) => setCurrentDevice(device) || setEditOpen(true);

  const handleDelete = async (device) => {
    if (window.confirm("คุณต้องการลบอุปกรณ์นี้หรือไม่?")) {
      const success = await SysDeleteDevice(device._id);
      if (success) {
        enqueueSnackbar("ลบอุปกรณ์เรียบร้อยแล้ว", { variant: "success" });
        setDevices((prev) => prev.filter((d) => d._id !== device._id));
      } else {
        enqueueSnackbar("เกิดข้อผิดพลาดในการลบอุปกรณ์", { variant: "error" });
      }
    }
  };

  const handleSubmit = async (values) => {
    const payload = { ...values, user_id: CURRENT_USER_ID };

    if (currentDevice) {
      const updated = await SysUpdateDevice(currentDevice._id, payload);
      if (updated) {
        enqueueSnackbar("บันทึกการแก้ไขอุปกรณ์เรียบร้อยแล้ว", { variant: "success" });
        setDevices((prev) =>
          prev.map((d) =>
            d.device_id === currentDevice.device_id ? updated : d
          )
        );
      } else {
        enqueueSnackbar("ไม่สามารถแก้ไขอุปกรณ์ได้", { variant: "error" });
      }
    } else {
      const created = await SysCreateDevice(payload);
      if (created) {
        enqueueSnackbar("เพิ่มอุปกรณ์ใหม่เรียบร้อยแล้ว", { variant: "success" });
        setDevices((prev) => [...prev, created]);
      } else {
        enqueueSnackbar("ไม่สามารถเพิ่มอุปกรณ์ได้", { variant: "error" });
      }
    }

    setAddOpen(false);
    setEditOpen(false);
    setCurrentDevice(null);
  };

  return (
    <Container>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={openAddDialog}
        size="small"
      >
        เพิ่มอุปกรณ์ใหม่
      </Button>

      {loading ? (
        <BoxLoading />
      ) : (
        <Grid container spacing={2}>
          {springs.map((style, i) => (
            <Grid item size={4} key={devices[i]._id} sx={{ minHeight: 400 }}>
              <animated.div style={style}>
                <DeviceWidget
                  device={devices[i]}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </animated.div>
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