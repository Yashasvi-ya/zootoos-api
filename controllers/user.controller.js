const { errorHandler } = require("../utils/error");
const User = require("../models/user.models.js");

exports.getUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return next(errorHandler(404, 'User not found'));
      }
      const { password, ...rest } = user._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
};

exports.signout = (req, res) => {
  try {
    res.clearCookie("access_token").status(200).json("User signed out")
  } catch (error) {
    next(errorHandler(500, error))
  }
}

