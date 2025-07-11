//Sensors
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

// System info
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import WifiTwoToneIcon from '@mui/icons-material/WifiTwoTone';
import Wifi2BarTwoToneIcon from '@mui/icons-material/Wifi2BarTwoTone';
import Wifi1BarTwoToneIcon from '@mui/icons-material/Wifi1BarTwoTone';
import WifiOffTwoToneIcon from '@mui/icons-material/WifiOffTwoTone';

export const DEVICE_STATUS = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  MAINTENANCE: "MAINTENANCE",
};
export const ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
};
export const NOTIFICATION_TYPE = {
  SUCCESS: { name: "สำเร็จ", color: "success" },
  ERROR: { name: "เกิดข้อผิดพลาด", color: "error" },
  WARNING: { name: "คำเตือน", color: "warning" },
  INFO: { name: "ข้อมูล", color: "info" },
  DEFAULT: { name: "ปกติ", color: "default" },
};

export const SENSORS_TYPE = {
  TEMPERATURE: {
    key: 'temperature',
    type: "temperature",
    name: "อุณหภูมิ",
    unit: "°C",
    icon: <ThermostatIcon />,
  },
  HUMIDITY: {
    key: 'humidity',
    type: "humidity",
    name: "ความชื้น",
    unit: "%",
    icon: <WaterDropIcon />,
  },
  LIGHT: {
    key: 'light',
    type: "light",
    name: "แสง",
    unit: "",
    icon: <LightbulbIcon />,
  },
};

export const STYLES = {
  borderRadius: 2,
};

export const SIGNAL_ICON = {
  GOOD: <WifiTwoToneIcon color="success" />,
  MEDIUM: <Wifi2BarTwoToneIcon color="warning" />,
  BAD: <Wifi1BarTwoToneIcon color="error" />,
  OFFLINE: <WifiOffTwoToneIcon color="default" />,
}

export const ICON = {
    INFO:       { icon: <InfoIcon/>, color: "info" },
    SUCCESS:    { icon: <CheckCircleIcon/>, color: "success" },
    ERROR:      { icon: <ErrorIcon/>, color: "error" },
    WARNING:    { icon: <WarningIcon/>, color: "warning" },
    DEFAULT:    { icon: <CheckCircleIcon/>, color: "default" },

    ADD:        { icon: <AddCircleIcon/>, color: "success" },
    EDIT:       { icon: <DesignServicesIcon/>, color: "warning" },
    REMOVE:     { icon: <RemoveCircleIcon/>, color: "error" },

    SAVE:       { icon: <SaveIcon/>, color: "info" },
    DELETE:     { icon: <DeleteIcon/>, color: "error" }, 
};