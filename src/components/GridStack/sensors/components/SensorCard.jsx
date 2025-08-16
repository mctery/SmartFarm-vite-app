import React from "react";
import {
  Stack,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import SensorFrame from "./SensorFrame";
import { formatValue } from "../utils/number";

export default function SensorCard({
  icon,
  value,
  unit,
  title,
  deviceId,
  sensorKey,
  loading,
  bgcolor,
  CenterIcon, // ไอคอนใหญ่ตรงกลาง (ถ้ามี)
}) {
  return (
    <SensorFrame loading={loading} bgcolor={bgcolor}>
      {/* header */}
      <Stack direction="row" spacing={0.5} alignItems="center">
        {icon}
        <Typography variant="subtitle2">{title}</Typography>
      </Stack>

      {/* value */}
      <Box
        sx={{
          mt: 0.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {CenterIcon && <CenterIcon sx={{ fontSize: 48 }} />}
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mt: 0.5 }}>
          <Typography variant="h3" sx={{ fontWeight: 600, lineHeight: 1 }}>
            {formatValue(value)}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, lineHeight: 1 }}>
            {unit}
          </Typography>
        </Box>
      </Box>

      {/* footer */}
      <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,.25)" }} />
      <Typography
        variant="caption"
        sx={{
          opacity: 0.8,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {deviceId ?? "-"} | {sensorKey ?? "-"}
      </Typography>
    </SensorFrame>
  );
}
