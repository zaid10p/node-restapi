const { validationResult } = require("express-validator/check");

const User = require("../models/user");

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({ status: user.status });
  } catch (e) {
    next(e);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    user.status = req.body.status;
    await user.save();
    res.status(200).json({ message: "Status updated!" });
  } catch (e) {
    next(e);
  }
};
