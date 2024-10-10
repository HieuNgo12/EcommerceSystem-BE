import express from "express";
import reviewController from "../controllers/reviewController.mjs";
import authenticationController from "../controllers/authenticationController.mjs";

const ReviewRouter = (app) => {
  const router = express.Router();

  // Get all reviews for a product (public)
  router.get("/:productId/reviews", reviewController.getProductReviews);

  // Add a review for a product (all)
  router.post(
    "/:productId/reviews",
    authenticationController.authMiddleware,
    authenticationController.isUser,
    reviewController.addReview
  );

  // Update a review (owner or admin only)
  router.put(
    "/reviews/:reviewId",
    authenticationController.authMiddleware,
    reviewController.updateReview
  );

  // Delete a review (owner or admin only)
  router.delete(
    "/reviews/:reviewId",
    authenticationController.authMiddleware,
    reviewController.deleteReview
  );

};

export default ReviewRouter;
