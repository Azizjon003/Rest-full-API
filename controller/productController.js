const AppError = require("../utility/AppError");
const Product = require("../model/product");
const catchAsync = require("../utility/catchAsync");
const mongoose = require("mongoose");
const { promisify } = require("util");
const FeatureApi = require("../utility/featureAPi");
const {
  getProduct,
  setProduct,
  deleteProduct,
  getAll,
} = require("../redis/productRedis");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  let data = new FeatureApi(req.query, Product)
    .filter()
    .sort()
    .field()
    .pagenation();
  console.log(data);
  data = await data.databaseQuery;
  console.log(req.query);
  if (!data[0]) {
    return next(new AppError("No data found", 404));
  }
  res.status(200).json({
    status: "success",
    results: data.length,
    data: {
      data,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid Id", 400));
  }
  let data = await getProduct(id);
  let son = 1;

  son = data ? 1 : 0;
  if (!data) {
    data = await Product.findById(id);
    if (!data) {
      return next(new AppError("No data found", 404));
    }
    setProduct(data);
  }
  data = son == 1 ? JSON.parse(data) : data;
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.createProduct = catchAsync(async (req, res, next) => {
  const file = req.imageUrl;
  req.body.image = file;
  const data = await Product.create(req.body);
  let product = await setProduct(data);
  console.log(product);
  if (!data) {
    return next(new AppError("No data found", 404));
  }

  res.status(201).json({
    status: "success",
    data,
  });
});
exports.updateProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new AppError("Please provide id", 400));
  }

  const data = await Product.updateOne({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  const product = await Product.findOne({ _id: id });
  await setProduct(product);
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
  let product = await deleteProduct(id);
  if (!data) {
    return next(new AppError("No data found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
