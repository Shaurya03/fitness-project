export const getDisplayDistanceUnit = (
  inputUnit,
  distanceSystem
) => {

  const unitMap = {

    km: {
      metric: "km",
      imperial: "mi"
    },

    mi: {
      metric: "km",
      imperial: "mi"
    },

    m: {
      metric: "m",
      imperial: "ft"
    },

    ft: {
      metric: "m",
      imperial: "ft"
    }

  };

  return unitMap[inputUnit]?.[distanceSystem] ?? "km";
};