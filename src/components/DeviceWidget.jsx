import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  Typography,
  CardActions,
  IconButton,
  Chip,
  Stack,
  Box,
  useTheme,
  Divider,
  Tooltip,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CellTowerIcon from "@mui/icons-material/CellTower";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from '@mui/icons-material/Settings';

import { MQTTSubscribe, MQTTConnect } from "../services/mqtt_service";
import { STYLES, SIGNAL_ICON } from "../services/global_variable";

// const defaultPayload = {
//   addr: null,
//   device_id: null,
//   v: null,
//   ip: null,
//   subnet: null,
//   gateway: null,
//   rssi: null,
// }

export default function DeviceWidget({ device, onEdit, onDelete }) {
  const [realtime, setRealtime] = useState(null);
  const [signal, setSignal] = useState(SIGNAL_ICON.OFFLINE);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // let isMounted = true; // ป้องกัน setState หลัง unmount
    let unsubscribeCheckin = null;
    let unsubscribeWill = null;

    async function fetchMQTT() {
      try {
        unsubscribeCheckin = await MQTTSubscribe(`device/${device.device_id}/checkin`, (payload) => {
          setRealtime(payload);
        });

        unsubscribeWill = await MQTTSubscribe(`device/${device.device_id}/will`, () => {
          setRealtime(null);
        });
      } catch (err) {
        console.warn("MQTTSubscribe Error:", err);
      }
    }

    fetchMQTT();

    return () => {
      // isMounted = false; // ✅ ป้องกัน memory leak ในบางเคส
      unsubscribeCheckin?.(); // ✅ cleanup
      unsubscribeWill?.();
    };
  }, [device.device_id]);


  //Signal Strength
  useEffect(() => {
    const rssi = realtime?.addr?.rssi;

    if (typeof rssi !== "number") {
      setSignal(SIGNAL_ICON.OFFLINE);
    } else if (rssi >= -40) {
      setSignal(SIGNAL_ICON.GOOD);
    } else if (rssi >= -70) {
      setSignal(SIGNAL_ICON.MEDIUM);
    } else if (rssi >= -90) {
      setSignal(SIGNAL_ICON.BAD);
    } else {
      setSignal(SIGNAL_ICON.OFFLINE);
    }
  }, [realtime?.addr?.rssi]);

  const signalIconBox = {
    position: "absolute",
    top: -20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: "20%",
    zIndex: 1,
    bgcolor: theme.palette.grey[200],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: 2,
  };

  const cardStyle = {
    height: 390, // ✅ ความสูงคงที่
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // ✅ ช่วยจัดเนื้อหากระจายพอดี
    position: "relative",
  };

  return (
    <Box sx={{ position: "relative", mb: 2 }}>
      <Box sx={signalIconBox}>{signal}</Box>
      <Card sx={cardStyle}>
        <CardHeader
          title={ <Typography variant="h6" sx={{ color: theme.palette.mode === "light" ? "white" : "darkgray" }}>{device.name}</Typography> }
          subheader={ <Typography variant="caption" sx={{ color: "white" }}>รหัสอุปกรณ์: {device.device_id}</Typography> }
          sx={{ backgroundColor: realtime ? theme.palette.success.main : theme.palette.grey[600], px: 2, py: 1.5 }}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200, // ✅ ให้ภาพอยู่ในขนาดคงที่
            }}
          >
            {device.image ? (
              <Box
                sx={{
                  width: 180,
                  height: 180,
                  overflow: "hidden",
                  borderRadius: STYLES.borderRadius,
                }}
              >
                <CardMedia
                  component="img"
                  image={device.image}
                  alt={device.name}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">ไม่มีรูปภาพ</Typography>
            )}
          </Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mt: 1 }}
          >
            <Typography variant="body2">สถานะการทำงาน:</Typography>
            <Chip
              label={realtime ? "ONLINE" : "OFFLINE"}
              color={realtime ? "success" : "default"}
              size="small"
            />
          </Stack>
          <Divider sx={{ m: 1 }} />
          <Stack direction="row" spacing={1} alignItems="center" justifyContent={"space-between"}>
            <Box>
              <Tooltip title="ดูข้อมูลอุปกรณ์">
                <IconButton
                  size="small"
                  aria-label="gridstack"
                  onClick={() => navigate(`gridstack/${device.device_id}`)}
                  color="info"
                >
                  <HomeIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="ตั้งค่าอุปกรณ์">
                <IconButton
                  size="small"
                  aria-label="edit"
                  onClick={() => onEdit(device)}
                  color="info"
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Tooltip title="ลบอุปกรณ์">
              <IconButton
                size="small"
                aria-label="delete"
                onClick={() => onDelete(device)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            {/* {realtime && (
              <Typography
                variant="caption"
                sx={{ ml: 1 }}
                color="text.secondary"
                noWrap
              >
                {JSON.stringify(realtime)}
              </Typography>
            )} */}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

DeviceWidget.propTypes = {
  device: PropTypes.shape({
    device_id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    online_status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    image: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
