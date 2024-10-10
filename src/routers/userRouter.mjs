import express from "express";
import authenticationController from "../controllers/authenticationController.mjs";
import userController from "../controllers/userController.mjs";

const router = express.Router();

router.post("/logout", authenticationController.logout);

router.post("/send-verification-email", userController.sendVerificationEmail);

router.post("/send-verification-phone", userController.sendVerificationPhone);

router.post("/verify-email", userController.verificationEmail);

router.post("/verify-phone", userController.verificationPhone);

router.patch("/change-password", userController.changePassword);

router.put("/update-all-information", userController.updateAllUser);

router.patch("/update-information", userController.updateUser);

export default router;
