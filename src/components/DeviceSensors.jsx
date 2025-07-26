import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import TemperatureSensor from './GridStack/sensors/TemperatureSensor';
import HumiditySensor from './GridStack/sensors/HumiditySensor';
import LightSensor from './GridStack/sensors/LightSensor';
import SoilSensor from './GridStack/sensors/SoilSensor';

export default function DeviceSensors({ data = {} }) {
  return (
    <Stack spacing={0.5}>
      <TemperatureSensor value={data.temperature} />
      <HumiditySensor value={data.humidity} />
      <LightSensor value={data.light} />
      <SoilSensor value={data.soil} />
    </Stack>
  );
}

DeviceSensors.propTypes = {
  data: PropTypes.object,
};
