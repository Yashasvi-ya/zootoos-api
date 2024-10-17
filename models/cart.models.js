const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name : {
        type: String,
        required: true
      },
      price : {
        type : Number,
        required: true
      },
      qty: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
    },
  ],
},{timestamps : true}
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
