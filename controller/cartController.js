const Cart = require("../model/cart");
const AppError = require("../utility/AppError");
const catchAsync = require("../utility/catchAsync");
const logger = require("../utility/logger");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Product = require("../model/product");
const IsProduct = async (id) => {
  const product = await Product.findById(id);
  return product;
};
const cookieCreater = (id) => {
  let token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user._id, condition: "false" });

  if (!cart) {
    return next(new AppError("No cart found", 404));
  }
  res.status(200).json({
    status: "success",
    cart,
  });
});
exports.addToCart = catchAsync(async (req, res, next) => {
  const { products } = req.body;
  let data = [];
  let cost = 0;
  for (let i = 0; i < cart.products.length; i++) {
    let pricecha = await IsProduct(products[i].productId);
    if (pricecha) {
      data.push(products[i]);
      cost = cost + products[i].count * pricecha.price;
    }
  }

  let id = req.user._id;
  const cart = await Cart.findOne({ userId: id, condition: "false" });
  if (!cart) {
    const newCart = await Cart.create({
      products: data,
      userId: id,
      condition: "false",
      cost,
    });
    return res.status(201).json({
      status: "success",
      cart: newCart,
      carttoken: cookieCreater(cart._id),
    });
  }
  data = [...cart.products, ...data];
  cart.products = data;
  cart.cost = cart.cost + cost;
  await cart.save();
  res.status(200).json({
    status: "success",
    cart,
    carttoken: cookieCreater(cart._id),
  });
});

exports.paymentCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const cartId = req.cart._id;
  const userCost = req.user.cost;
  const cartCost = req.cart.cost;
  if (userCost < cartCost) {
    return next(new AppError("Insufficient balance", 400));
  }
  const cart = await Cart.updateOne({ _id: cartId }, { condition: "true" });
  const user = await User.updateOne(
    { _id: userId },
    { cost: userCost - cartCost }
  );
  res.status(200).json({
    status: "success",
    message: "Payment successful",
  });
});
exports.deleteCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndDelete(req.cart._id);
  res.status(200).json({
    status: "success",
    message: "Cart deleted",
  });
});
