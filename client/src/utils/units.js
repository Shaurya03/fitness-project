export const UNITS = {
  weight: {
    kg: {
      label: "kg",
      step: 2.5,
      precision: 1,
      toBase: value => value,
      fromBase: value => value
    },

    lb: {
      label: "lb",
      step: 5,
      precision: 1,
      toBase: value => value * 0.453592,
      fromBase: value => value / 0.453592
    }
  },

  distance: {
    m: {
      label: "m",
      step: 1,
      precision: 1,
      toBase: value => value,
      fromBase: value => value
    },

    km: {
      label: "km",
      step: 0.1,
      precision: 2,
      toBase: value => value * 1000,
      fromBase: value => value / 1000
    },

    ft: {
      label: "ft",
      step: 1,
      precision: 1,
      toBase: value => value * 0.3048,
      fromBase: value => value / 0.3048
    },

    mi: {
      label: "mi",
      step: 0.1,
      precision: 2,
      toBase: value => value * 1609.34,
      fromBase: value => value / 1609.34
    }
  },

  duration: {
    seconds: {
      label: "sec",
      toBase: value => value,
      fromBase: value => value
    },

    minutes: {
      label: "min",
      toBase: value => value * 60,
      fromBase: value => value / 60
    },

    hours: {
      label: "hr",
      toBase: value => value * 3600,
      fromBase: value => value / 3600
    }
  }
};

export const DISTANCE_SYSTEMS = {
  metric: ["km", "m"],
  imperial: ["mi", "ft"]
};