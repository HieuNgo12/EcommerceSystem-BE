import express from "express";
import reviewController from "../controllers/reviewController.mjs";
import authenticationController from "../controllers/authenticationController.mjs";
import supportController from "../controllers/supportController.mjs";
import validate from "../utils/validate.mjs";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Get all support for a product (public)
// Add a review for a product (all)
router.post(
  "/api/v1/support",
  // authenticationController.authMiddleware,
  // authenticationController.isUser,
  upload.single("file"),
  supportController.addSupport
);

// Hòa
router.get(
  "/api/v1/support",
  validate.authentication,
  validate.auhthorizationAdmin,
  supportController.getSupport
);

router.get(
  "/api/v1/support/:email",
  validate.authentication,
  supportController.getSupportByEmail
);

router.patch(
  "/api/v1/support/:supportId",
  validate.authentication,
  validate.auhthorizationAdmin,
  supportController.editSupport
);

router.delete(
  "/api/v1/support/:supportId",
  validate.authentication,
  validate.auhthorizationAdmin,
  supportController.deleteSupport
);

router.post(
  "/api/v1/support/:supportId",
  validate.authentication,
  validate.auhthorizationAdmin,
  supportController.replyCustomer
);

export default router;
