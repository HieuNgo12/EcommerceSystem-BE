import express from "express";
import userController from "../controllers/userController.mjs";
import authenticationController from "../controllers/authenticationController.mjs";

const router = express.Router();

router.post("/signup", authenticationController.register);

router.post("/login", authenticationController.login);

router.post("/forgot-password", authenticationController.forgotPassword);

router.post("/reset-password", authenticationController.resetPassword);

export default router;
