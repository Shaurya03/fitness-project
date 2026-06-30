import { DEFAULT_UNITS } from "./settings";
import { UNITS } from "./units";

const pad = number =>
  String(number).padStart(2, "0");

export const formatMetric = (
  metric,
  value,
  settings,
  inputUnits = {},
  showUnit = true
) => {

  switch (metric) {

    case "weight": {
      const unit =
        inputUnits.weight ??
        DEFAULT_UNITS[settings.weightSystem].weight;

      const config = UNITS.weight[unit];

      const formattedValue =
        config.fromBase(value)
          .toFixed(config.precision);

      return showUnit
        ? `${formattedValue} ${unit}`
        : formattedValue;
    }

    case "distance": {
      const unit =
        inputUnits.distance ??
        DEFAULT_UNITS[settings.distanceSystem].distance;

      const config = UNITS.distance[unit];

      const formattedValue =
        config.fromBase(value)
          .toFixed(config.precision);

      return showUnit
        ? `${formattedValue} ${unit}`
        : formattedValue;
    }

    case "duration": {

      if (value == null) {
        return "";
      }

      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = value % 60;

      if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
      }

      return `${pad(minutes)}:${pad(seconds)}`;
    }

    case "pace": {

      if (value == null) {
        return "";
      }

      const totalSeconds = Math.round(value);

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      const unit =
        settings.distanceSystem === "metric"
          ? "km"
          : "mi";

      return `${minutes}:${pad(seconds)}/${unit}`;
    }

    case "speed": {

      if (value == null) {
        return "";
      }

      const unit =
        settings.distanceSystem === "metric"
          ? "km/h"
          : "mph";

      return `${value.toFixed(1)} ${unit}`;
    }

    default:
      return value;
  }
};