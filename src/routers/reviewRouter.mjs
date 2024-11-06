import express from "express";
import reviewController from "../controllers/reviewController.mjs";
import authenticationController from "../controllers/authenticationController.mjs";
import multer from "multer";
import FileController from "../controllers/fileController.mjs";
import validate from "../utils/validate.mjs";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

// Get all reviews for a product (public)
router.get("/api/v1/reviews/:productId", reviewController.getProductReviews);

router.get("/api/v1/getReviews", reviewController.getReviews);

// Add a review for a product (all)
router.post(
  "/api/v1/reviews",
  // authenticationController.authMiddleware,
  // authenticationController.isUser,
  reviewController.addReview
);

// Update a review (owner or admin only)
// Hòa
router.patch(
  "/api/v1/update-reviews/:reviewId",
  validate.authentication,
  validate.auhthorizationAdmin,
  reviewController.addReply
);


// Hiếu
router.put(
  "/api/v1/reviews",
  // authenticationController.authMiddleware,
  reviewController.updateReview
);

// Delete a review (owner or admin only)
router.delete(
  "/api/v1/reviews/:reviewId",
  validate.authentication,
  validate.auhthorizationAdmin,
  reviewController.deleteReview
);
router.post(
  "/api/v1/reviews/uploadFile",
  upload.single("file"),
  reviewController.uploadSingleFile
);

export default router;
