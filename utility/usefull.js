const AppError = require("../utility/AppError");
const mongoose = require("mongoose");
exports.resFunk = async (data, statusCode, res) => {
  const { name, price, salePrice, image, _id } = data;
  const resData = {
    name,
    price,
    salePrice,
    image,
    id: _id,
  };
  res.status(statusCode).json({
    status: "success",
    data: resData,
  });
};
exports.isData = (data, statusCode, next) => {
  if (!data) {
    return next(new AppError("No data found", statusCode));
  }
};
exports.isId = (id, next) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid Id", 400));
  }
};
exports.resFunkArray = async (data, statusCode, res) => {
  let resData = [];
  for (let i = 0; i < data.length; i++) {
    const { name, price, salePrice, image, description } = data[i];

    resData.push({
      name,
      price,
      salePrice,
      image,
      description,
      id: data[i]._id,
    });
  }
  res.status(statusCode).json({
    status: "success",
    data: resData,
  });
};
