const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  paymentCart,
  deleteCart,
  protectCart,
} = require("../controller/cartController");

const authController = require("../controller/authController");
router.route("/getcart").get(authController.protect, getCart);
router.route("/addtocart").post(authController.protect, addToCart);
router
  .route("/paymentcart")
  .get(authController.protect, protectCart, paymentCart);
router
  .route("/deletecart")
  .get(authController.protect, protectCart, deleteCart);

module.exports = router;
