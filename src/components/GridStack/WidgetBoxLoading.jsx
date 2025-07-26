import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

const WidgetBoxLoading = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.background.paper,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        px: 2,
      }}
    >
      <CircularProgress size={36} thickness={4} sx={{ mb: 1 }} />
      <Typography variant="body2" color="text.secondary">
        กำลังโหลดข้อมูล...
      </Typography>
    </Box>
  );
};

export default WidgetBoxLoading;
