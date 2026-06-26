import { getMetricConfig } from "./metricConfig";

export const formatMetric = (metric, value) => {
  const config = getMetricConfig(metric);

  return config.showUnit
    ? `${config.label}: ${value} ${config.unit}`
    : `${config.label}: ${value}`;
};