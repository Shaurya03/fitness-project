export const METRIC_CONFIG = {
  weight: {
    label: "Weight",
    showUnit: true,
    min: 0
  },

  reps: {
    label: "Reps",
    showUnit: false,
    step: 1,
    min: 0
  },

  distance: {
    label: "Distance",
    showUnit: true,
    min: 0
  },

  duration: {
    label: "Duration",
    showUnit: false,
    step: 1,
    min: 0
  },

  calories: {
    label: "Calories",
    unit: "kcal",
    showUnit: true,
    step: 10,
    min: 0
  },

  heartRate: {
    label: "Heart Rate",
    unit: "bpm",
    showUnit: true,
    step: 1,
    min: 0,
    max: 250
  },

  rpe: {
    label: "RPE",
    showUnit: false,
    step: 1,
    min: 1,
    max: 10
  },

  laps: {
    label: "Laps",
    showUnit: false,
    step: 1,
    min: 0
  },

  pace: {
    label: "Pace",
    showUnit: false
  },

  speed: {
    label: "Speed",
    showUnit: false
  }
};

export const getMetricConfig = (metric) =>
  METRIC_CONFIG[metric] || {
    label: metric,
    unit: "",
    showUnit: false,
    step: 1,
    min: 0
  };