export const DERIVED_METRICS = [
  {
    key: "pace",
    dependencies: ["distance", "duration"]
  },
  {
    key: "speed",
    dependencies: ["distance", "duration"]
  }
];