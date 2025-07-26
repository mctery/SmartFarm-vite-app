import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WidgetBoxLoading from '../WidgetBoxLoading';

export default function TemperatureSensor({ deviceId, widget }) {

  const [isLoading, setIsLoading] = useState(true);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [currentWidget, setCurrentWidget] = useState(null);

  useEffect(() => {
    initial();
  }, []);

  function initial() {
      try {
        setIsLoading(true);
        setCurrentDevice(deviceId);
        setCurrentWidget(widget);
      } catch (error) {
        console.error("error initial:", error);
      } finally {
        setIsLoading(false);
      }
  }

  if (isLoading) {
    return <WidgetBoxLoading />;
  }

  // return (
  //   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
  //     <DeviceThermostatIcon fontSize="small" color="error" />
  //     {/* <Typography variant="body2">{value ?? '-'}</Typography> */}
  //   </Box>
  // );
}

TemperatureSensor.propTypes = {
  deviceId: PropTypes.oneOfType([PropTypes.string]),
  widget: PropTypes.oneOfType([PropTypes.string]),
};
