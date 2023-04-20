const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const { validate } = require("../controller/validationUser");
const authController = require("../controller/authController");
const { productSchema } = require("../validation/product");
router
  .route("/")
  .get(getAllProducts)
  .post(authController.protect, validate(productSchema), createProduct);
router.route("/:id").get(getProduct).delete(deleteProduct).patch(updateProduct);

module.exports = router;
