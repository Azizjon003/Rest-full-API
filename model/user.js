const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      min: [5, "So'z uzunligi to'g'ri emas"],
    },
    surname: {
      type: String,
      required: [true, "Surname is required"],
      min: [5, "So'z uzunligi to'g'ri kelmaydi"],
    },
    email: {
      type: String,
      tolowercase: true,
      required: true,
    },
    photo: {
      type: String,
      default: "photo.jpg",
    },
    password: {
      type: String,
      required: true,
      min: [8, "8 ta belgidan kam bo'lishi mumkin emas"],
    },
    passwordConfirm: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
