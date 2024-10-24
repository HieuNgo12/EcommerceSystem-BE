import express from "express";
import authenticationController from "../controllers/authenticationController.mjs";
import productController from "../controllers/productController.mjs";
import validate from "../utils/validate.mjs";
import FileController from "../controllers/fileController.mjs";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", productController.getProduct); // oke 

router.get("/:productId", productController.getProductById); 

router.get("/category/:categoryId", productController.getCategoryById);

router.post("/add-product", productController.addProduct); // oke 

router.put("/update-all-product/:productId",validate.authentication, validate.auhthorizationAdmin, productController.updateAllProduct);

router.patch("/update-product/:productId", upload.single("file"), FileController.singleUploadForProduct,  productController.updateProduct);

router.delete("/delete-product/:productId", productController.deleteProduct);

router.post("/single-upload", upload.single("file"), FileController.singleUploadForProduct);

router.post("/multi-upload", upload.array("files"), FileController.multiUploadForProduct);

export default router;
