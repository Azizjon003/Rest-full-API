const Cart = require("../model/cart");
const AppError = require("../utility/AppError");
const catchAsync = require("../utility/catchAsync");
const logger = require("../utility/logger");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Product = require("../model/product");
const User = require("../model/user");
const IsProduct = async (id) => {
  const product = await Product.findById(id);
  return product;
};
const saveTokenCookie = (res, token, req) => {
  // shu cookieni ishlashini sorimiz
  res.cookie("cart", token, {
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: req.protocol === "https" ? true : false,
  });
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
  console.log(products);
  let data = [];
  let cost = 0;
  for (let i = 0; i < products.length; i++) {
    let pricecha = await IsProduct(products[i].productId);
    if (pricecha) {
      data.push(products[i]);
      cost = cost + products[i].count * pricecha.price;
    }
  }

  let id = req.user._id;
  const cart = await Cart.findOne({ userId: id, condition: "false" });
  let token;

  console.log(token);
  if (!cart) {
    const newCart = await Cart.create({
      products: data,
      userId: id,
      condition: "false",
      cost,
    });
    token = cookieCreater(newCart._id);
    saveTokenCookie(res, token, req);
    return res.status(201).json({
      status: "success",
      cart: newCart,
      carttoken: token,
    });
  }
  token = cookieCreater(cart._id);
  saveTokenCookie(res, token, req);
  data = [...cart.products, ...data];
  cart.products = data;

  cart.cost = cart.cost + cost;
  await cart.save();

  res.status(200).json({
    status: "success",
    cart,
    carttoken: token,
  });
});

exports.paymentCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const cartId = req.cart._id;
  const userCost = req.user.cost;
  const cartCost = req.cart.cost;
  console.log(userCost, cartCost);
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
exports.protectCart = catchAsync(async (req, res, next) => {
  const { cart } = req.cookies;
  console.log(cart);

  if (!cart) {
    return next(new AppError("Please login to continue", 401));
  }
  const decoded = await promisify(jwt.verify)(cart, process.env.JWT_SECRET);
  const cartjon = await Cart.findOne({ _id: decoded.id, condition: "false" });
  if (!cartjon) {
    return next(new AppError("No cart found", 404));
  }
  req.cart = cartjon;
  next();
});
