const { errorHandler } = require("../utils/error");
const User = require("../models/user.models.js");
const Cart = require("../models/cart.models.js");

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

exports.signout = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("User signed out");
  } catch (error) {
    next(errorHandler(500, error));
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, name, price, qty, size } = req.body;

    if ( !userId || !productId || !qty || !size || !name || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, cartItems: [] });
    }

    const existingItemIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size
    );

    if (existingItemIndex > -1) {
      cart.cartItems[existingItemIndex].qty += parseInt(qty);
      cart.cartItems[existingItemIndex].price += price;
    } else {
      cart.cartItems.push({
        product: productId,
        qty,
        size,
        name,
        price : price * parseInt(qty)
      });
    }

    await cart.save();
    res.status(200).json({ cartItems: cart.cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.removeFromCart = (req, res) => {};

exports.getCart = async (req, res, next) => {
  const {userId}  = req.body
  try {
    const cart = await Cart.findOne({ user: userId });
    if(!cart) {
      return res.status(404, "User has no items in cart")
    }
    return res.status(200).json(cart)
  } catch (error) {
    next(errorHandler(500, 'Internal Server Error'))
  }
}
