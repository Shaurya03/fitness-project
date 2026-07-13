import { UNITS } from "./units";
import { getDisplayDistanceUnit } from "./getDisplayDistanceUnit";

export function getDisplaySet({
  set,
  settings,
  DEFAULT_WEIGHT_UNIT,
  DEFAULT_DISTANCE_UNIT
}) {

  const metrics = structuredClone(set.metrics);

  if (metrics.weight != null) {

    const weightConfig =
      UNITS.weight[DEFAULT_WEIGHT_UNIT];

    metrics.weight = Number(
      weightConfig
        .fromBase(metrics.weight)
        .toFixed(weightConfig.precision)
    );

  }

  if (metrics.distance != null) {

    const displayUnit =
      getDisplayDistanceUnit(
        set.inputUnits?.distance ??
        DEFAULT_DISTANCE_UNIT,
        settings.distanceSystem
      );

    const distanceConfig =
      UNITS.distance[displayUnit];

    metrics.distance = Number(
      distanceConfig
        .fromBase(metrics.distance)
        .toFixed(distanceConfig.precision)
    );

  }

  if (metrics.duration != null) {

    const hours =
      Math.floor(metrics.duration / 3600);

    const minutes =
      Math.floor(
        (metrics.duration % 3600) / 60
      );

    const seconds =
      metrics.duration % 60;

    metrics.duration = {
      hours: hours || "",
      minutes: minutes || "",
      seconds: seconds || ""
    };

  }

  return {

    metrics,
    inputUnits: {
      weight: DEFAULT_WEIGHT_UNIT,
      distance:
        getDisplayDistanceUnit(
          set.inputUnits?.distance ??
          DEFAULT_DISTANCE_UNIT,
          settings.distanceSystem
        )
    }
  };
}