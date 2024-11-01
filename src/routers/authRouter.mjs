import express from "express";
import authenticationController from "../controllers/authenticationController.mjs";
import AdminController from "../controllers/adminController.mjs";
import userController from "../controllers/userController.mjs";

const router = express.Router();

router.post("/signup", authenticationController.register); //ok

router.post("/signup-by-gg", authenticationController.registerByGG); //ok

router.post("/login", authenticationController.login); //ok

router.post("/login-by-gg", authenticationController.loginByGG); //ok

router.post("/forgot-password", authenticationController.forgotPassword); //ok

router.post("/reset-password", authenticationController.resetPassword); //ok

router.post("/refresh-token", authenticationController.refreshToken); //ok

export default router;
