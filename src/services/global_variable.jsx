//Sensors
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GrassIcon from '@mui/icons-material/Grass';

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
  temperature: {
    key: 'temperature',
    type: "temperature",
    name: "อุณหภูมิ",
    unit: "°C",
    icon: <ThermostatIcon />,
  },
  humidity: {
    key: 'humidity',
    type: "humidity",
    name: "ความชื้น",
    unit: "%",
    icon: <WaterDropIcon />,
  },
  light: {
    key: 'light',
    type: "light",
    name: "แสง",
    unit: "",
    icon: <LightbulbIcon />,
  },
  soil: {
    key: 'soil',
    type: "soil",
    name: "ความชื้นดิน",
    unit: "%",
    icon: <GrassIcon />,
  },
};

const WIDGET_TYPE = {
  watherlive: { key: 'watherlive', type: 'watherlive', name: 'รายงานสภาพอากาศ' },
  temperature: { key: 'temperature', type: 'temperature', name: 'อุณหภูมิ' },
  humidity: { key: 'humidity', type: 'humidity', name: 'ความชื้น' },
  light: { key: 'light', type: 'light', name: 'แสง' },
}

export const WEATHER_ICON = {
  "01d": <i className="wi wi-day-sunny" />,
  "01n": <i className="wi wi-night-clear" />,
  "02d": <i className="wi wi-day-cloudy" />,
  "02n": <i className="wi wi-night-alt-cloudy" />,
  "03d": <i className="wi wi-cloud" />,
  "03n": <i className="wi wi-cloud" />,
  "04d": <i className="wi wi-cloudy" />,
  "04n": <i className="wi wi-cloudy" />,
  "09d": <i className="wi wi-showers" />,
  "09n": <i className="wi wi-showers" />,
  "10d": <i className="wi wi-day-rain" />,
  "10n": <i className="wi wi-night-rain" />,
  "11d": <i className="wi wi-thunderstorm" />,
  "11n": <i className="wi wi-thunderstorm" />,
  "13d": <i className="wi wi-snow" />,
  "13n": <i className="wi wi-snow" />,
  "50d": <i className="wi wi-fog" />,
  "50n": <i className="wi wi-fog" />,
  DEFAULT: <i className="wi wi-na" />
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

export const MQTT_TOPIC = [
  `device/+/temperature`,
  `device/+/humidity`,
  `device/+/light`,
  `device/+/soil`,

  `device/+/will`
]