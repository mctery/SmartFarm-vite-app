// src/components/GridStack/widgets/WidgetLiveWeather.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import useResizeObserver from "@react-hook/resize-observer";

import WidgetBoxLoading from "./WidgetBoxLoading";
import { WEATHER_ICON } from "../../services/global_variable";

/* ---------- env ---------- */
const API_KEY   = import.meta.env.VITE_WATHER_KEY;
const API_BASE  = import.meta.env.VITE_WATHER_URL;
const DEFAULT_CITY = "Bangkok";
const WEATHER_COLORS = {
  Clear:        "#fdd835", // แดดออก (Yellow 600)
  Clouds:       "#90a4ae", // เมฆครึ้ม (BlueGrey 300)
  Rain:         "#1565c0", // ฝน (Blue 800)
  Drizzle:      "#4fc3f7", // ฝนปรอย
  Thunderstorm: "#4527a0", // พายุ
  Snow:         "#90caf9", // หิมะ
  Mist:         "#607d8b", // หมอก/ควัน
  Fog:          "#607d8b",
  Smoke:        "#6d4c41",
  Haze:         "#8d6e63",
  Dust:         "#a1887f",
};

/* ---------- helpers ---------- */
const formatDate = () => new Date().toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short",});
const formatTime = (unix, tzOffset = 0) => new Date((unix + tzOffset) * 1000).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

export default function WidgetLiveWeather({ city = DEFAULT_CITY, containerRef }) {
  const theme = useTheme();

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(0);               // (ยังใช้ใน clamp font)

  useResizeObserver(containerRef, entry => setWidth(entry.contentRect.width));

  /* ---------- fetch ---------- */
  const fetchWeather = async () => {
    console.log(city);
    setLoading(true);
    try {
      const url = `${API_BASE}?q=${city}&appid=${API_KEY}&units=metric&lang=th`;
      const { data } = await axios.get(url);

      console.log(data);

      const iconCode = data.weather[0].icon;
      const mainCond = data.weather[0].main;      // <— “Clear” | “Clouds” | “Rain” …

      setWeather({
        name:        data.name,
        iconNode:    WEATHER_ICON[iconCode] || WEATHER_ICON.DEFAULT,
        temp:        data.main.temp.toFixed(0),
        humidity:    data.main.humidity,
        wind:        data.wind.speed.toFixed(1),
        clouds:      data.clouds.all,
        description: data.weather[0].description,
        condition:   mainCond,                    // <— เก็บไว้ใช้เลือกสี
        updatedAt:   formatDate(),
        updatedTime: formatTime(data.dt, data.timezone),
      });
      
    } catch (err) {
      console.error("❌ Error fetching weather:", err);
      setLoading(true);
      return 0;
    }
    setLoading(false);
  };

  useEffect(() => { fetchWeather(); }, [city]);

  /* ---------- early skeleton ---------- */
  if (loading && !weather) return <WidgetBoxLoading />;

  /* ---------- styles ---------- */
  const bg        = theme.palette.primary.main;
  const tempFont  = `clamp(32px, ${Math.min(width / 7, 48)}px, 48px)`; // responsive
  const baseColor = WEATHER_COLORS[weather.condition] || theme.palette.primary.main;
  const gradient  = `linear-gradient(135deg, ${alpha(baseColor, 0.95)} 0%, ${alpha(baseColor, 0.75)} 100%)`;

  return (
    <Fade in={!loading} timeout={{ enter: 600, exit: 400 }} mountOnEnter unmountOnExit>
      <Box
        sx={{
          background: gradient,
          color: "#fff",
          height: "100%",
          borderRadius: 2,
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: 3,
          minHeight: 170,
        }}
      >
        {/* ---------- header ---------- */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              background: "#fff",
              color: bg,
              px: 1,
              py: 0.25,
              borderRadius: 1,
            }}
          >
            {weather.updatedAt}
          </Typography>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocationOnIcon fontSize="inherit" />
            <Typography variant="caption">{weather.name}</Typography>
          </Stack>
        </Stack>

        {/* ---------- temp & icon ---------- */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5, flexWrap: "wrap" }}>
          <Box sx={{ fontSize: 50 }}>{weather.iconNode}</Box>
          <Typography sx={{ fontSize: tempFont, fontWeight: 700, lineHeight: 1 }}>{weather.temp}°</Typography>
          <Typography variant="h6" sx={{ textTransform: "capitalize", fontWeight: 400, flexShrink: 0 }}>{weather.description}</Typography>
        </Stack>

        {/* ---------- footer ---------- */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption">💧 {weather.humidity}% &nbsp;|&nbsp; 💨 {weather.wind} m/s &nbsp;|&nbsp; ☁️ {weather.clouds}%</Typography>
          <Tooltip title="รีเฟรช">
            <IconButton size="small" sx={{ color: "#fff" }} onClick={fetchWeather}><RefreshIcon fontSize="inherit" /></IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Fade>
  );
}
