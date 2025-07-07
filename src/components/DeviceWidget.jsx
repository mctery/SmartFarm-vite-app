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

import { subscribeDeviceRealtime } from "../services/global_function";
import { STYLES } from "../services/global_variable";

export default function DeviceWidget({ device, onEdit, onDelete }) {
  const [realtime, setRealtime] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeDeviceRealtime(device.device_id, (msg) => {
      setRealtime(msg);
    });
    return unsubscribe;
  }, [device.device_id]);

  const signalIconBox = {
    position: "absolute",
    top: -20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: "20%",
    zIndex: 1,
    bgcolor: theme.palette.background.paper,
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
      <Box sx={signalIconBox}>
        <CellTowerIcon color="success" />
      </Box>
      <Card sx={cardStyle}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ color: "white" }}>
              {device.name}
            </Typography>
          }
          subheader={
            <Typography variant="caption" sx={{ color: "white" }}>
              รหัสอุปกรณ์: {device.device_id}
            </Typography>
          }
          sx={{
            backgroundColor: theme.palette.success.main,
            px: 2,
            py: 1.5,
          }}
          action={
            device.online_status && (
              <Chip
                label={device.online_status === "A" ? "ออนไลน์" : "ออฟไลน์"}
                color={device.online_status === "A" ? "success" : "default"}
                size="small"
              />
            )
          }
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
              <Typography variant="body2" color="text.secondary">
                ไม่มีรูปภาพ
              </Typography>
            )}
          </Box>

          {device.status && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Typography variant="body2">สถานะการทำงาน:</Typography>
              <Chip
                label={device.status === "A" ? "เปิดใช้งาน" : "ปิดการใช้งาน"}
                color={device.status === "A" ? "success" : "default"}
                size="small"
              />
            </Stack>
          )}
          <Divider sx={{ m: 1 }} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="แก้ไขอุปกรณ์">
              <IconButton
                size="small"
                aria-label="edit"
                onClick={() => onEdit(device)}
                color="warning"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

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

            {realtime && (
              <Typography
                variant="caption"
                sx={{ ml: 1 }}
                color="text.secondary"
                noWrap
              >
                {JSON.stringify(realtime)}
              </Typography>
            )}
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
