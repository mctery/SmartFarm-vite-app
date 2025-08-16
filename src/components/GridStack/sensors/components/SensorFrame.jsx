import React from "react";
import { Box, Fade, useTheme, alpha } from "@mui/material";
import WidgetBoxLoading from "../../WidgetBoxLoading";

export default function SensorFrame({ loading, bgcolor, children }) {
  const theme = useTheme();
  const base  = bgcolor || theme.palette.primary.main;
  const gradient = `linear-gradient(135deg, ${alpha(base, 0.95)} 0%, ${alpha(
    base,
    0.75
  )} 100%)`;

  if (loading) return <WidgetBoxLoading />;

  return (
    <Fade in timeout={{ enter: 600, exit: 400 }} mountOnEnter unmountOnExit>
      <Box
        sx={{
          background: gradient,
          color: "#fff",
          p: 2,
          borderRadius: 2,
          minHeight: 170,
          height: "100%",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {children}
      </Box>
    </Fade>
  );
}
