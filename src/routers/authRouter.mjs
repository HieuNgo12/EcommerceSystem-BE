import express from "express";
import authenticationController from "../controllers/authenticationController.mjs";
import AdminController from "../controllers/adminController.mjs";
import userController from "../controllers/userController.mjs";

const router = express.Router();

router.post("/signup", authenticationController.register);

router.post("/login", authenticationController.login);

router.post("/forgot-password", authenticationController.forgotPassword);

router.post("/reset-password", authenticationController.resetPassword);

router.post("/refresh-token", authenticationController.refreshToken);

export default router;
