import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Chip,
  Stack,
  Box,
  useTheme
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CellTowerIcon from "@mui/icons-material/CellTower";
import { subscribeDeviceRealtime } from "../service/global_function";

export default function DeviceWidget({ device, onEdit, onDelete }) {
  const [realtime, setRealtime] = useState(null);
  const theme = useTheme();

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
    minHeight: 200,
    // px: 2,
    // pt: 2,
    // pb: 1,
    position: "relative",
  };

  return (
    <Box sx={{ position: "relative", mb: 2 }}>
      <Box sx={signalIconBox}>
        <CellTowerIcon color="success" />
      </Box>
      <Card sx={cardStyle}>
        {/* Uncomment if using image */}
        {/* {device.image && (
          <CardMedia component="img" height="140" image={device.image} alt={device.name} />
        )} */}
        <CardContent sx={{ pb: 0 }}>
          <Typography variant="h6" gutterBottom>{device.name}</Typography>
          <Typography variant="body2" color="text.secondary">ID: {device.device_id}</Typography>

          {device.status && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Typography variant="body2">สถานะ:</Typography>
              <Chip
                label={device.status === "A" ? "ปกติ" : "ปิด"}
                color={device.status === "A" ? "success" : "default"}
                size="small"
              />
            </Stack>
          )}
        </CardContent>

        <CardActions sx={{ mt: 1 }}>
          <IconButton aria-label="edit" onClick={() => onEdit(device)} color="warning">
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => onDelete(device)} color="error">
            <DeleteIcon />
          </IconButton>
          {realtime && (
            <Typography variant="caption" sx={{ ml: 1 }} color="text.secondary" noWrap>
              {JSON.stringify(realtime)}
            </Typography>
          )}
        </CardActions>
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
