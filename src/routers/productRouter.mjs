import express from "express";
import authenticationController from "../controllers/authenticationController.mjs";
import productController from "../controllers/productController.mjs";
import validate from "../utils/validate.mjs";

const router = express.Router();

router.get("/", productController.getProduct);

router.get("/:productId", productController.getProductById);

router.get("/category/:categoryId", productController.getCategoryById);

router.post("/add-product", validate.authentication, validate.auhthorizationAdmin, productController.addProduct);

router.put("/update-all-product/:productId",validate.authentication, validate.auhthorizationAdmin, productController.updateAllProduct);

router.patch("/update-product/:productId",validate.authentication, validate.auhthorizationAdmin, productController.updateProduct);

router.delete("/delete-product/:productId",validate.authentication, validate.auhthorizationAdmin, productController.deleteProduct);

export default router;
