import PropTypes from "prop-types";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import { SENSORS_TYPE } from "../../../services/global_variable";

import useSensorValue from "./hooks/useSensorValue";
import useAnimatedNumber from "./hooks/useAnimatedNumber";
import SensorCard from "./components/SensorCard";

export default function Temperature({ deviceId, widget }) {
  const topic = `device/${deviceId}/temperature`;
  const [val, loading] = useSensorValue(topic, widget.sensorKey);
  const display = useAnimatedNumber(val);

  return (
    <SensorCard
      icon={SENSORS_TYPE.temperature.icon}
      CenterIcon={DeviceThermostatIcon}
      title={widget.title ?? "Temperature"}
      value={display}
      unit={widget.unit}
      deviceId={deviceId}
      sensorKey={widget.sensorKey}
      loading={loading}
      bgcolor={widget.bgcolor}
    />
  );
}

Temperature.propTypes = {
  deviceId: PropTypes.string,
  widget: PropTypes.shape({
    title:     PropTypes.string,
    sensorKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit:      PropTypes.string,
    bgcolor:   PropTypes.string,
  }),
};
