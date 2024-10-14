const { errorHandler } = require("../utils/error");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.models");

exports.signup = async (req, res, next) => {
  const { username, email, password, shippingAddress } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    !shippingAddress ||
    username === "" ||
    email === "" ||
    password === "" ||
    shippingAddress === ""
  ) {
    next(errorHandler(400, "Provide all the required fields"));
  }

  const securedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: securedPassword,
    shippingAddress,
  });

  try {
    await newUser.save();
    res.json("Sign up Successfull");
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "Provide all the required fields"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return next(errorHandler(404, "Wrong Password"));
    }
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = user._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
