import authenticationController from "../controllers/authenticationController.mjs";
import userController from "../controllers/userController.mjs";
import express from "express";

const router = express.Router();

router.post("/send-verification-email", userController.sendVerificationEmail);

router.post("/send-verification-phone", userController.updateUser);

router.post("/verify-email", userController.verificationEmail);

router.post("/verify-phone", userController.updateUser);

router.patch("/user", userController.updateUser);

router.delete("/user/:userId", userController.deleteUser);

router.patch("/change-password", userController.changePassword);

export default router;
