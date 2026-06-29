import { DEFAULT_UNITS } from "./settings";
import { UNITS } from "./units";

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
        : `${formattedValue}`
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
        : `${formattedValue}`
    }

    case "duration": {

      if (value === undefined || value === null) {
        return "";
      }

      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = value % 60;

      const pad = number => String(number).padStart(2, "0");

      if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
      }

      return `${pad(minutes)}:${pad(seconds)}`;

    }

    default:
      return value;
  }
};