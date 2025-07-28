import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import { WEATHER_ICON } from "../../services/global_variable";
import WidgetBoxLoading from "./WidgetBoxLoading";
import useResizeObserver from "@react-hook/resize-observer";

const API_KEY = import.meta.env.VITE_WATHER_KEY;
const API_BASE = import.meta.env.VITE_WATHER_URL;
const DEFAULT_CITY = "Bangkok";

const formatDate = () =>
  new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

const formatTime = (unix, tzOffset = 0) => {
  const date = new Date((unix + tzOffset) * 1000);
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function getWindDirection(deg) {
  const directions = [
    "เหนือ",
    "ตะวันออกเฉียงเหนือ",
    "ตะวันออก",
    "ตะวันออกเฉียงใต้",
    "ใต้",
    "ตะวันตกเฉียงใต้",
    "ตะวันตก",
    "ตะวันตกเฉียงเหนือ",
  ];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

export default function WidgetLiveWather({ city = DEFAULT_CITY, containerRef }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(0);

  useResizeObserver(containerRef, (entry) => {
    setWidth(entry.contentRect.width);
  });

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const fetchWeather = async () => {
    setLoading(true);

    try {
      const url = `${API_BASE}?q=${city}&appid=${API_KEY}&units=metric&lang=th`;
      const response = await axios.get(url);
      const weatherData = response.data;

      const iconCode = weatherData.weather[0].icon;
      const information = {
        name: weatherData.name,
        weatherIcon: WEATHER_ICON[iconCode] || WEATHER_ICON.DEFAULT,
        temp: weatherData.main.temp.toFixed(0),
        humidity: weatherData.main.humidity,
        wind: weatherData.wind.speed.toFixed(2),
        clouds: weatherData.clouds.all,
        description: weatherData.weather[0].description,
        fetchUpdate: formatDate()
      }

      setWeather(information);
    } catch (err) {
      console.error("❌ Error fetching weather:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !weather) return <WidgetBoxLoading />;

  // const iconCode = weather.weather[0].icon;
  // const WeatherIcon = WEATHER_ICON[iconCode] || WEATHER_ICON.DEFAULT;
  // const temp = weather.main.temp.toFixed(0);
  // const humidity = weather.main.humidity;
  // const wind = weather.wind.speed.toFixed(2);
  // const clouds = weather.clouds.all;
  // const description = weather.weather[0].description;
  // const tempMin = weather.main.temp_min;
  // const tempMax = weather.main.temp_max;
  // const seaLevel = weather.main.sea_level;
  // const groundLevel = weather.main.grnd_level;
  // const visibility = weather.visibility;
  // const windGust = weather.wind.gust;
  // const windDeg = weather.wind.deg;
  // const updatedAt = formatTime(weather.dt, weather.timezone);
  // const windDirection = getWindDirection(windDeg);
  // const dateStr = formatDate();

  return (
    <Box
      sx={{
        backgroundColor: "#1976d2",
        color: "#fff",
        height: "100%",
        borderRadius: 2,
        p: 1.5,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 1.2,
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          fontSize={12}
          fontWeight="bold"
          sx={{
            background: "#fff",
            color: "#1976d2",
            px: 1,
            py: 0.3,
            borderRadius: 1,
          }}
        >
          {weather.fetchUpdate}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <LocationOnIcon fontSize="small" />
          <Typography fontSize={12}>{weather.name}</Typography>
        </Stack>
      </Stack>

      {/* Temperature + Icon */}
      <Stack direction="row" alignItems="center" spacing={3}>
        <Box sx={{ fontSize: 50 }}>{weather.weatherIcon}</Box>
        <Typography fontWeight="bold" sx={{ fontSize: "clamp(32px, 6vw, 48px)" }}>{weather.temp}°</Typography>
        <Typography fontSize={32} sx={{ textTransform: "capitalize" }}>{weather.description}</Typography>
      </Stack>
          
      <Stack direction="row" alignItems="center" justifyContent={"space-between"} spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontSize={14}>💧 ความชื้น: {weather.humidity}%</Typography>
          <Typography fontSize={14}>💨 {weather.wind} m/s</Typography>
          <Typography fontSize={14}>☁️ {weather.clouds}%</Typography>
        </Stack>
        {/* <Typography fontSize={13}>🌡️ สูงสุด/ต่ำสุด: {tempMax}° / {tempMin}°</Typography>
        <Typography fontSize={13}>🧭 ทิศลม: {windDirection}</Typography>
        <Typography fontSize={13}>💥 ลมกระโชก: {windGust} m/s</Typography>
        <Typography fontSize={13}>👁️ ทัศนวิสัย: {(visibility / 1000).toFixed(1)} กม.</Typography>
        <Typography fontSize={12} sx={{ opacity: 0.8 }}>⏱️ อัปเดตล่าสุด: {updatedAt}</Typography> */}

        <Tooltip title="รีเฟรช">
          <IconButton onClick={fetchWeather} size="small" sx={{ color: "#fff" }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}
