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
const { upload } = require("../controller/uploadController");
router
  .route("/")
  .get(getAllProducts)
  .post(
    authController.protect,
    authController.role("admin"),
    upload,
    validate(productSchema),
    createProduct
  );
router
  .route("/:id")
  .get(getProduct)
  .delete(authController.protect, deleteProduct)
  .patch(authController.protect, updateProduct);

module.exports = router;
