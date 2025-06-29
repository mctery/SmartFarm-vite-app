import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

export default function TemperatureSensor({ value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <DeviceThermostatIcon fontSize="small" color="error" />
      <Typography variant="body2">{value ?? '-'}</Typography>
    </Box>
  );
}

TemperatureSensor.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
