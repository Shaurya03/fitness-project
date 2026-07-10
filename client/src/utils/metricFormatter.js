import { DEFAULT_UNITS } from "./settings";
import { UNITS } from "./units";
import { getDisplayDistanceUnit } from "./getDisplayDistanceUnit";

const pad = number =>
  String(number).padStart(2, "0");

export const formatMetric = (
  metric,
  value,
  settings,
  inputUnits = {},
  showUnit = true
) => {

  const weightSystem =
    settings?.weightSystem ?? "metric";

  const distanceSystem =
    settings?.distanceSystem ?? "metric";

  switch (metric) {

    case "weight": {

      if (value == null) {
        return "";
      }

      const unit =
        inputUnits.weight ??
        DEFAULT_UNITS[weightSystem].weight;

      const config =
        UNITS.weight[unit];

      const formattedValue =
        config.fromBase(value)
          .toFixed(config.precision);

      return showUnit
        ? `${formattedValue} ${unit}`
        : formattedValue;
    }

    case "distance": {

      if (value == null) {
        return "";
      }

      const inputUnit =
        inputUnits.distance ??
        DEFAULT_UNITS[distanceSystem].distance;

      const displayUnit =
        getDisplayDistanceUnit(
          inputUnit,
          distanceSystem
        );

      const config =
        UNITS.distance[displayUnit];

      const formattedValue =
        config.fromBase(value)
          .toFixed(config.precision);

      return showUnit
        ? `${formattedValue} ${displayUnit}`
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
        distanceSystem === "metric"
          ? "km"
          : "mi";

      return `${minutes}:${pad(seconds)}/${unit}`;
    }

    case "speed": {

      if (value == null) {
        return "";
      }

      const unit =
        distanceSystem === "metric"
          ? "km/h"
          : "mph";

      return `${value.toFixed(1)} ${unit}`;
    }

    default:
      return value;
  }
};