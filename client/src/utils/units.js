const DECIMAL_PLACES = 2;

export const UNITS = {
  weight: {
    kg: {
      label: "kg",
      toBase: value => value,
      fromBase: value => value
    },

    lb: {
      label: "lb",
      toBase: value => value * 0.453592,
      fromBase: value => Number((value / 0.453592).toFixed(DECIMAL_PLACES))
    }
  },

  distance: {
    m: {
      label: "m",
      toBase: value => value,
      fromBase: value => value
    },

    km: {
      label: "km",
      toBase: value => value * 1000,
      fromBase: value => Number((value / 1000).toFixed(DECIMAL_PLACES))
    },

    ft: {
      label: "ft",
      toBase: value => value * 0.3048,
      fromBase: value => Number((value / 0.3048).toFixed(DECIMAL_PLACES))
    },

    mi: {
      label: "mi",
      toBase: value => value * 1609.34,
      fromBase: value => Number((value / 1609.34).toFixed(DECIMAL_PLACES))
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