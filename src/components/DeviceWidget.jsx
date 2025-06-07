import * as React from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { subscribeDeviceRealtime } from "../service/global_function";

export default function DeviceWidget({ device, onEdit, onDelete }) {
  const [realtime, setRealtime] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = subscribeDeviceRealtime(device.device_id, (msg) => {
      setRealtime(msg);
    });
    return unsubscribe;
  }, [device.device_id]);

  return (
    <Card sx={{ minHeight: 200 }}>
      {device.image && (
        <CardMedia
          component="img"
          height="140"
          image={device.image}
          alt={device.name}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {device.name}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          {"online_status" in device && (
            <Chip
              label={device.online_status ? "ออนไลน์" : "ออฟไลน์"}
              color={device.online_status ? "success" : "default"}
              size="small"
            />
          )}
          {"status" in device && (
            <Chip
              label={device.status ? "เปิด" : "ปิด"}
              color={device.status ? "primary" : "default"}
              size="small"
            />
          )}
        </Stack>
      </CardContent>
      <CardActions>
        <IconButton aria-label="edit" onClick={() => onEdit(device)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => onDelete(device)}>
          <DeleteIcon />
        </IconButton>
        {realtime && (
          <Typography variant="caption" sx={{ ml: 1 }} color="text.secondary">
            {JSON.stringify(realtime)}
          </Typography>
        )}
      </CardActions>
    </Card>
  );
}

DeviceWidget.propTypes = {
  device: PropTypes.shape({
    device_id: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    online_status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    image: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
