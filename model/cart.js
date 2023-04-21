const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: String,
        count: Number,
      },
    ],
    cost: Number,
    condition: {
      type: String,
      enum: ["false", "middle", "true"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("cart", CartSchema);

module.exports = Cart;
