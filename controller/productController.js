const AppError = require("../utility/AppError");
const Product = require("../model/product");
const catchAsync = require("../utility/catchAsync");
const mongoose = require("mongoose");
const { promisify } = require("util");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  if (!products[0]) {
    return next(new AppError("No data found", 404));
  }
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid Id", 400));
  }

  const data = await Product.findById(id);
  if (!data) {
    return next(new AppError("No data found", 404));
  }
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.createProduct = catchAsync(async (req, res, next) => {
  const data = await Product.create(req.body);
  if (!data) {
    return next(new AppError("No data found", 404));
  }

  res.status(201).json({
    status: "success",
    data,
  });
});
exports.updateProduct = catchAsync(async (req, res, next) => {
  const id = require.params.id;
  if (!id) {
    return next(new AppError("Please provide id", 400));
  }

  const data = await Product.updateOne({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  const product = await Product.findOne({ _id: id });
  if (!product) {
    return next(new AppError("No data found", 404));
  }
  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new AppError("Please provide id", 400));
  }

  const data = await Product.findByIdAndDelete(id);
  if (!data) {
    return next(new AppError("No data found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
