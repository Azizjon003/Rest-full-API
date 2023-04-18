const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
      unique: true,
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
    jins: {
      type: String,
      enum: ["erkak", "ayol"],
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
userSchema.pre("updateOne", async function (next) {
  if (!this._update?.password) return next();
  const hashPass = await bcrypt.hash(this._update.password, 12);
  this._update.password = hashPass;
  this._update.passwordConfirm = undefined;
  this._update.passwordChangedAt = Date.now();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hashPass = await bcrypt.hash(this.password, 12);
  this.password = hashPass;
  this.passwordConfirm = undefined;
});
userSchema.methods.correctPassword = async function (password, hashPass) {
  return await bcrypt.compare(password, hashPass);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
