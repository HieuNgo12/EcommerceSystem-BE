import express from "express";
import reviewController from "../controllers/reviewController.mjs";
import authenticationController from "../controllers/authenticationController.mjs";
import supportController from "../controllers/supportController.mjs";

const router = express.Router();

// Get all support for a product (public)
// Add a review for a product (all)
router.post(
  "/api/v1/support",
  // authenticationController.authMiddleware,
  // authenticationController.isUser,
  supportController.addSupport
);

export default router;
