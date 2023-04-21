const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: String,
        count: Number,
      },
    ],
    cost: {
      type: Number,
      required: [true, "Please provide cost"],
    },
    condition: {
      type: String,
      enum: ["false", "middle", "true"],
      default: "false",
      required: [true, "Please provide condition"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Please provide user id"],
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("cart", CartSchema);

module.exports = Cart;
