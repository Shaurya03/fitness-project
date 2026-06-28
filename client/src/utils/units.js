export const UNITS = {
  weight: {
    kg: {
      label: "kg",
      toBase: value => value
    },

    lb: {
      label: "lb",
      toBase: value => value * 0.453592
    }
  },

  distance: {
    m: {
      label: "m",
      toBase: value => value
    },

    km: {
      label: "km",
      toBase: value => value * 1000
    },

    ft: {
      label: "ft",
      toBase: value => value * 0.3048
    },

    mi: {
      label: "mi",
      toBase: value => value * 1609.34
    }
  },

  duration: {
    sec: {
      label: "sec",
      toBase: value => value
    },

    min: {
      label: "min",
      toBase: value => value * 60
    },

    hr: {
      label: "hr",
      toBase: value => value * 3600
    }
  }
};