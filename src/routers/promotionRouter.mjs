import express from "express";
import authenticationController from "../controllers/authenticationController.mjs";
import userController from "../controllers/userController.mjs";
import multer from "multer";
import FileController from "../controllers/fileController.mjs";
import AdminController from "../controllers/adminController.mjs";
import PromotionController from "../controllers/promotionController.mjs";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.get("/get-promotion", PromotionController.getPromotion);

router.post(
  "/add-promotion",
  upload.single("file"),
  PromotionController.addPromtion
);

router.patch(
  "/update-promotion/:promotionId",
  upload.single("file"),
  FileController.singleUpdateForPromotion,
  PromotionController.updatePromotion
);

router.delete("/delete-promotion/:promotionId", PromotionController.deletePromotion);

export default router;
