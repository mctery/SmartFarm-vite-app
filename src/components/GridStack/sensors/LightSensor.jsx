import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function LightSensor({ value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <LightModeIcon fontSize="small" color="warning" />
      <Typography variant="body2">{value ?? '-'}</Typography>
    </Box>
  );
}

LightSensor.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};