import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import YardIcon from '@mui/icons-material/Yard';

export default function SoilSensor({ value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <YardIcon fontSize="small" color="success" />
      <Typography variant="body2">{value ?? '-'}</Typography>
    </Box>
  );
}

SoilSensor.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
