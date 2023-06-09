const User = require("../model/user");
const AppError = require("../utility/AppError");
const catchAsync = require("../utility/catchAsync");
const logger = require("../utility/logger");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const OptionSort = function (options, permission) {
  const option = {};

  Object.keys(options).forEach((key) => {
    if (permission.includes(key)) option[key] = options[key];
  });

  return option;
};
const jwtToken = (id, admin) => {
  let token = jwt.sign(
    { id: id, isAdmin: admin == "admin" ? true : false },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
};
const signUp = catchAsync(async (req, res, next) => {
  const file = req.imageUrl;

  req.body.photo = file;
  const user = await User.create(req.body);

  const token = jwtToken(user._id, user.role);

  res.status(201).json({
    status: "success",
    token,
  });
});
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const isCorrect = await user.correctPassword(password, user.password);
  if (!isCorrect) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = jwtToken(user._id, user.role);
  res.status(200).json({
    status: "success",
    token,
    role: user.role,
  });
});
const updatePassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm, passwordCurrent } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }

  if (password !== passwordConfirm) {
    return next(
      new AppError("Password and password confirm are not same", 400)
    );
  }
  try {
    await User.updateOne({ _id: req.user.id }, { password });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
  const token = jwtToken(user._id, user.role);

  res.status(200).json({
    status: "success",
    token,
  });
});
const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    if (req.cookies?.jwt) {
      token = req.cookies?.jwt;
    } else {
      return next(new AppError("Jwt not found", 401));
    }
  }

  if (!token) {
    return next(new AppError("Please log in", 401));
  }
  let id;
  // tokenni tekshirish kerak
  try {
    id = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new AppError(error.message, 401));
  }
  if (!id) {
    return next(new AppError("Please log in", 401));
  }
  // user bazada bor yo'qligini tekshirib olish
  const user = await User.findById(id.id);

  if (!user) {
    return next(new AppError("User is not found", 401));
  }

  // if (id.ieat < user.passwordChangedAt.getTime() / 1000) {
  //   return next(new AppError("jwt malformet", 401));
  // }
  req.user = user;
  res.locals.user = user;
  next();
});
const updateMe = catchAsync(async (req, res, next) => {
  const id = req.user._id;
  console.log(req.body);
  const optionPermission = ["name", "surname", "email", "photo", "jins"];
  const file = req.imageUrl;
  console.log(file);
  let option = {};
  option.name = req.body.name || req.user.name;
  option.surname = req.body.surname || req.user.surname;
  option.email = req.body.email || req.user.email;
  option.photo = file || req.user.photo;
  option.jins = req.body.jins || req.user.jins;

  const options = OptionSort(option, optionPermission);
  console.log(options);
  const user = await User.updateOne({ _id: id }, options, {
    new: true,
    runValidators: true,
  });
  const userData = await User.findById(id);
  res.status(200).json({
    status: "success",
    data: userData,
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  logger.debug(JSON.stringify(req.user));
  const deleteData = await User.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
  });
});
const role = (roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Siz bu huquqga ega emassiz", 401));
    }
    next();
  });
};

const isSignin = catchAsync(async (req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!req.cookies.jwt || req.cookies.jwt == "logout") {
    return next();
  }

  // tokenni tekshirish kerak
  const id = await promisify(jwt.verify)(token, process.env.SECRET);
  if (!id) {
    return next();
  }
  // user bazada bor yo'qligini tekshirib olish

  const user = await User.findById(id.id);

  if (!user) {
    return next();
  }
  res.locals.user = user;
  return next();
});
const logout = (req, res, next) => {
  res.cookie("jwt", "logout", {
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    token: "logout",
  });
};

const me = catchAsync(async (req, res, next) => {
  const user = {
    name: req.user.name,
    surname: req.user.surname,
    email: req.user.email,
    photo: req.user.photo,
  };
  res.status(200).json({
    user,
  });
});

module.exports = {
  signUp,
  login,
  updatePassword,
  protect,
  isSignin,
  logout,
  role,
  updateMe,
  deleteUser,
  me,
  jwtToken,
};
