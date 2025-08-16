import PropTypes from "prop-types";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { SENSORS_TYPE } from "../../../services/global_variable";

import useSensorValue from "./hooks/useSensorValue";
import useAnimatedNumber from "./hooks/useAnimatedNumber";
import SensorCard from "./components/SensorCard";

export default function HumiditySensor({ deviceId, widget }) {
  const topic = `device/${deviceId}/humidity`;
  const [value, loading] = useSensorValue(topic, widget.sensorKey);

  const display = useAnimatedNumber(value);
  return (
    <SensorCard
      icon={SENSORS_TYPE.humidity.icon}
      CenterIcon={WaterDropIcon}
      title={widget.title ?? "Humidity"}
      value={display}
      unit={widget.unit}
      deviceId={deviceId}
      sensorKey={widget.sensorKey}
      loading={loading}
      bgcolor={widget.bgcolor}
    />
  );
}

HumiditySensor.propTypes = {
  deviceId: PropTypes.string,
  widget: PropTypes.shape({
    title:     PropTypes.string,
    sensorKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit:      PropTypes.string,
    bgcolor:   PropTypes.string,
  }),
};
