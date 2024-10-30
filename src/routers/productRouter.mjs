import express from "express";
import authenticationController from "../controllers/authenticationController.mjs";
import productController from "../controllers/productController.mjs";
import validate from "../utils/validate.mjs";
import FileController from "../controllers/fileController.mjs";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", productController.getProduct); 

router.get("/:productId", productController.getProductById); 

router.get("/category/:categoryId", productController.getCategoryById);

router.post("/add-product", validate.authentication, validate.auhthorizationAdmin,upload.single("file"), productController.addProduct); 

router.put("/update-all-product/:productId",validate.authentication, validate.auhthorizationAdmin, productController.updateAllProduct);

router.patch("/update-product/:productId", validate.authentication, validate.auhthorizationAdmin, upload.single("file"), FileController.singleUpdateForProduct,  productController.updateProduct);

router.delete("/delete-product/:productId",validate.authentication, validate.auhthorizationAdmin, productController.deleteProduct);

router.post("/single-upload", upload.single("file"), FileController.singleUploadForProduct);

router.post("/multi-upload", upload.array("files"), FileController.multiUploadForProduct);

export default router;
