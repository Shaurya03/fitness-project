const METRIC_PRIORITY = [
  "weight",
  "distance",
  "laps"
];

export function getTopSet(
  sets = [],
  exerciseMetrics = []
) {
  if (sets.length === 0) {
    return null;
  }

  const primaryMetric = METRIC_PRIORITY.find(metric =>
    exerciseMetrics.includes(metric)
  );

  if (!primaryMetric) {
    return sets.at(-1);
  }

  return [...sets].sort((a, b) => {

    const valueA = Number(
      a.metrics?.[primaryMetric] ?? 0
    );

    const valueB = Number(
      b.metrics?.[primaryMetric] ?? 0
    );

    if (valueA !== valueB) {
      return valueB - valueA;
    }

    if (
      primaryMetric === "weight" &&
      a.metrics?.reps != null &&
      b.metrics?.reps != null
    ) {
      return (
        Number(b.metrics.reps) -
        Number(a.metrics.reps)
      );
    }

    return (
      sets.indexOf(b) -
      sets.indexOf(a)
    );

  })[0];
}