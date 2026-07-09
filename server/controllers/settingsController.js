const Settings = require("../models/settingsModel");

const getSettings = async (req, res) => {
  const user_id = req.user._id;

  const settings = await Settings.findOne({
    user_id
  });

  if (!settings) {
    return res.status(404).json({
      error: "Settings not found"
    });
  }

  res.status(200).json(settings);
};

const updateSettings = async (req, res) => {
  const user_id = req.user._id;

  const {
    theme,
    weightSystem,
    distanceSystem
  } = req.body;

  const updates = {};

  if (theme !== undefined) {
    updates.theme = theme;
  }

  if (weightSystem !== undefined) {
    updates.weightSystem = weightSystem;
  }

  if (distanceSystem !== undefined) {
    updates.distanceSystem = distanceSystem;
  }

  const settings = await Settings.findOneAndUpdate(
    {
      user_id
    },
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!settings) {
    return res.status(404).json({
      error: "Settings not found"
    });
  }

  res.status(200).json(settings);
};

module.exports = {
  getSettings,
  updateSettings
};