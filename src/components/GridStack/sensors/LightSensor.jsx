import PropTypes from "prop-types";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { SENSORS_TYPE } from "../../../services/global_variable";

import useSensorValue from "./hooks/useSensorValue";
import useAnimatedNumber from "./hooks/useAnimatedNumber";
import SensorCard from "./components/SensorCard";

export default function LightSensor({ deviceId, widget }) {
  const topic = `device/${deviceId}/light`;
  const [value, loading] = useSensorValue(topic, widget.sensorKey);

  const display = useAnimatedNumber(value);
  return (
    <SensorCard
      icon={SENSORS_TYPE.light.icon}
      CenterIcon={LightbulbIcon}
      title={widget.title ?? "Light"}
      value={display}
      unit={widget.unit}
      deviceId={deviceId}
      sensorKey={widget.sensorKey}
      loading={loading}
      bgcolor={widget.bgcolor}
    />
  );
}

LightSensor.propTypes = {
  deviceId: PropTypes.string,
  widget: PropTypes.shape({
    title:     PropTypes.string,
    sensorKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit:      PropTypes.string,
    bgcolor:   PropTypes.string,
  }),
};
