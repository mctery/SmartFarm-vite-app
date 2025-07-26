import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

export default function HumiditySensor({ value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <WaterDropIcon fontSize="small" color="primary" />
      <Typography variant="body2">{value ?? '-'}</Typography>
    </Box>
  );
}

HumiditySensor.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
