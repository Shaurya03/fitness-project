import { DERIVED_METRICS } from "./derivedMetricsConfig";
import { UNITS } from "./units";

const getDistanceInDisplayUnit = (
  distance,
  distanceSystem
) => {

  const unit =
    distanceSystem === "metric"
      ? "km"
      : "mi";

  return UNITS.distance[unit].fromBase(distance);
};

export const calculatePace = (
  duration,
  distance,
  distanceSystem
) => {

  if (
    duration == null ||
    distance == null ||
    duration <= 0 ||
    distance <= 0
  ) {
    return null;
  }

  const distanceInUnit =
    getDistanceInDisplayUnit(
      distance,
      distanceSystem
    );

  return duration / distanceInUnit;
};

export const calculateSpeed = (
  duration,
  distance,
  distanceSystem
) => {

  if (
    duration == null ||
    distance == null ||
    duration <= 0 ||
    distance <= 0
  ) {
    return null;
  }

  const distanceInUnit =
    getDistanceInDisplayUnit(
      distance,
      distanceSystem
    );

  const hours = duration / 3600;

  return distanceInUnit / hours;
};

export const getDerivedMetrics = (
  metrics,
  distanceSystem
) => {

  const derivedMetrics = [];

  DERIVED_METRICS.forEach(metric => {

    const hasDependencies =
      metric.dependencies.every(
        dependency => metrics[dependency] != null
      );

    if (!hasDependencies) {
      return;
    }

    switch (metric.key) {

      case "pace":
        derivedMetrics.push({
          key: "pace",
          value: calculatePace(
            metrics.duration,
            metrics.distance,
            distanceSystem
          )
        });
        break;

      case "speed":
        derivedMetrics.push({
          key: "speed",
          value: calculateSpeed(
            metrics.duration,
            metrics.distance,
            distanceSystem
          )
        });
        break;

      default:
        break;
    }

  });

  return derivedMetrics;
};

export const getDisplayMetrics = (
  metrics,
  distanceSystem
) => {

  const storedMetrics = Object.entries(metrics).map(
    ([key, value]) => ({
      key,
      value
    })
  );

  return [
    ...storedMetrics,
    ...getDerivedMetrics(
      metrics,
      distanceSystem
    )
  ];
};