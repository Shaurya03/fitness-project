import { UNITS } from "./units";

export const formatMetric = (metric, value, settings) => {

  switch (metric) {

    case "weight": {
      const unit = settings.weightUnit;

      return `${UNITS.weight[unit].fromBase(value)} ${unit}`;
    }

    case "distance": {
      const unit = settings.distanceUnit;

      return `${UNITS.distance[unit].fromBase(value)} ${unit}`;
    }

    case "duration": {

      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = value % 60;

      const parts = [];

      if (value === undefined || value === null) {
        return "";
      }

      if (hours > 0) {
        parts.push(`${hours}h`);
      }

      if (minutes > 0) {
        parts.push(`${minutes}m`);
      }

      if (seconds > 0 || parts.length === 0) {
        parts.push(`${seconds}s`);
      }

      return parts.join(" ");
    }

    default:
      return value;
  }
};