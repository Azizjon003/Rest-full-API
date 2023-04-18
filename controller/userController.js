const User = require("../model/user");
const AppError = require("../utility/AppError");

const catchAsync = require("../utility/catchAsync");

function generatePassword(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+={}[]|;:<>,.?/";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  if (!users[0]) {
    return next(new AppError("No users found", 404));
  }
  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new AppError("Please provide an id", 400));
  }

  const user = await User.findOne({
    _id: id,
    active: true,
  });
  if (!User) {
    return next(new AppError("No user found", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.addUser = catchAsync(async (req, res, next) => {
  const { name, surname, email, jins } = req.body;
  if (!name || !surname || !email || !jins) {
    return next(new AppError("Please provide all fields", 400));
  }
  const password = generatePassword(8);
  const user = await User.create({
    name,
    surname,
    email,
    password,
    passwordConfirm: password,
  });
  if (!user) {
    return next(new AppError("User don't created"));
  }

  await res.status(200).json({
    status: "success",
    data: user,
    password,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new AppError("id not found", 404));
  }
  const data = await User.findByIdAndDelete(id);

  res.status(200).json({
    status: "succes",
    message: "User deleted",
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new AppError("id not found", 404));
  }
  const user = await User.findOne({
    _id: id,
  });
  let { name, surname, email, password } = req.body;
  name = name || user.name;
  surname = surname || user.surname;
  email = email || user.email;
  if (!password) {
    const data = await User.updateOne(
      {
        _id: id,
      },
      {
        name,
        surname,
        email,
      },

      {
        new: true,
        runValidators: true,
      }
    );
  }
  if (password) {
    let data = await User.updateOne(
      {
        _id: id,
      },
      {
        name,
        surname,
        email,
        password,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
  const userData = await User.findOne({
    _id: id,
  });
  res.status(200).json({
    status: "success",
    data: userData,
  });
});