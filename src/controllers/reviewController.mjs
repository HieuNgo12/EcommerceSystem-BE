import ReviewModel from "../database/models/review.mjs";
import ProductModel from "../database/models/product.mjs";
import UsersModel from "../database/models/users.mjs";
import { v2 as cloudinary } from "cloudinary";

const reviewController = {
  // Get all reviews for a product
  getProductReviews: async (req, res) => {
    const { productId } = req.params;
    try {
      const reviews = await ReviewModel.find({ productId });
      res.status(200).send({
        data: reviews,
        message: "Reviews retrieved successfully!",
        success: true,
      });
    } catch (error) {
      res
        .status(400)
        .send({ message: "Failed to retrieve reviews.", success: false });
    }
  },
  getReviews: async (req, res) => {
    const { userEmail, productId } = req.body;
    console.log(userEmail, productId);
    try {
      const reviews = await ReviewModel.find({ productId: productId }).populate(
        "userId"
      );

      console.log(reviews);
      res.status(200).send({
        data: reviews,
        message: "Reviews retrieved successfully!",
        success: true,
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).send({ message: error.message, success: false });
    }
  },
  // Add a new review (all)
  addReview: async (req, res) => {
    try {
      const body = req.body;
      const user = await UsersModel.findOne({
        email: body.user,
      });
      const review = await ReviewModel.create({ ...body, userId: user._id });
      console.log(review);
      res.status(201).send({
        data: review,
        message: "Review added successfully!",
        success: true,
      });
    } catch (error) {
      res.status(400).send({ message: error.message, success: false });
    }
  },

  // Update a review (owner/ admin)
  updateReview: async (req, res) => {
    const { reviewId } = req.params;
    try {
      const review = await ReviewModel.findById(reviewId);
      if (!review)
        return res
          .status(404)
          .send({ message: "Review not found.", success: false });

      if (
        req.user.role === "admin" ||
        req.user.id === review.userId.toString()
      ) {
        review.set(req.body);
        await review.save();
        res.status(200).send({
          data: review,
          message: "Review updated successfully!",
          success: true,
        });
      } else {
        res.status(403).send({ message: "Permission denied.", success: false });
      }
    } catch (error) {
      res
        .status(400)
        .send({ message: "Failed to update review.", success: false });
    }
  },

  // Delete a review (owner/ admin)
  deleteReview: async (req, res) => {
    const { reviewId } = req.params;
    try {
      const review = await ReviewModel.findById(reviewId);
      if (!review)
        return res
          .status(404)
          .send({ message: "Review not found.", success: false });

      if (
        req.user.role === "admin" ||
        req.user.id === review.userId.toString()
      ) {
        await review.remove();
        res
          .status(200)
          .send({ message: "Review deleted successfully!", success: true });
      } else {
        res.status(403).send({ message: "Permission denied.", success: false });
      }
    } catch (error) {
      res
        .status(400)
        .send({ message: "Failed to delete review.", success: false });
    }
  },
  uploadSingleFile: async (req, res) => {
    const file = req.file;
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    cloudinary.uploader.upload(dataUrl, (error, result) => {
      if (error) return res.send(error);

      return res.send(result);
    });
  },
};

export default reviewController;
