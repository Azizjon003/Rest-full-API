const User = require("../model/user");
const AppError = require("../utility/AppError");
const catchAsync = require("../utility/catchAsync");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const {
  singUpJoi,
  loginJoi,
  updatePasswordJoi,
} = require("../validation/validator");

const OptionSort = function (options, permission) {
  const option = {};
  console.log(permission);
  Object.keys(options).forEach((key) => {
    if (permission.includes(key)) option[key] = options[key];
  });

  return option;
};
const signUp = catchAsync(async (req, res, next) => {
  //sirtqi qo'shish kk
  // console.log(req.body);

  const { error, value } = singUpJoi(req.body);
  console.log(error);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  console.log(value);
  const user = await User.create(value);

  console.log(user);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    token,
  });
});
const login = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const { error, value } = loginJoi(req.body);
  console.log(error);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const { email, password } = value;
  const user = await User.findOne({ email }).select("+password");

  console.log(user);
  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const isCorrect = await user.correctPassword(password, user.password);
  if (!isCorrect) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token,
    role: user.role,
  });
});
const updatePassword = catchAsync(async (req, res, next) => {
  const { error, value } = updatePasswordJoi(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  const { password, passwordConfirm, passwordCurrent } = value;
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
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token,
  });
});
const protect = catchAsync(async (req, res, next) => {
  //1 tokenni tekshirish
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  }

  console.log(req.headers.authorization);

  console.log(token);
  // tokenni tekshirish kerak
  const id = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(id);
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
  const optionPermission = ["name", "surname"];
  let option = {};
  option.name = req.body.name || req.user.name;
  option.surname = req.body.surname || req.user.surname;

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
  console.log(req.user);
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
    console.log(req.user);
    console.log(roles.includes("admin"));
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Siz bu huquqga ega emassiz", 401));
    }
    next();
  });
};

const isSignin = catchAsync(async (req, res, next) => {
  let token;
  console.log(req.cookies);
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!req.cookies.jwt || req.cookies.jwt == "logout") {
    return next();
  }

  // tokenni tekshirish kerak
  const id = await promisify(jwt.verify)(token, process.env.SECRET);
  if (!id) {
    console.log("sana");
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
  console.log("logotga kirdi");
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
    lastname: req.user.lastname,
    balance: req.user.balance,
    cource: req.user.cource,
    email: req.user.email,
    role: req.user.role,
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
};
