import PropTypes from "prop-types";
import GrassIcon from "@mui/icons-material/Grass";
import { SENSORS_TYPE } from "../../../services/global_variable";

import useSensorValue from "./hooks/useSensorValue";
import useAnimatedNumber from "./hooks/useAnimatedNumber";
import SensorCard from "./components/SensorCard";

export default function SoilSensor({ deviceId, widget }) {
  const topic = `device/${deviceId}/soil`;
  const [value, loading] = useSensorValue(topic, widget.sensorKey);

  const display = useAnimatedNumber(value);
  return (
    <SensorCard
      icon={SENSORS_TYPE.soil.icon}
      CenterIcon={GrassIcon}
      title={widget.title ?? "Soil"}
      value={display}
      unit={widget.unit}
      deviceId={deviceId}
      sensorKey={widget.sensorKey}
      loading={loading}
      bgcolor={widget.bgcolor}
    />
  );
}

SoilSensor.propTypes = {
  deviceId: PropTypes.string,
  widget: PropTypes.shape({
    title:     PropTypes.string,
    sensorKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit:      PropTypes.string,
    bgcolor:   PropTypes.string,
  }),
};
