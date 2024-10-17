import express from "express";
import authenticationController from "../controllers/authenticationController.mjs";
import userController from "../controllers/userController.mjs";
import multer from "multer";
import FileController from "../controllers/fileController.mjs";
import AdminController from "../controllers/adminController.mjs";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/logout", authenticationController.logout);

router.post("/send-verification-email", userController.sendVerificationEmail);

router.post("/send-verification-phone", userController.sendVerificationPhone);

router.post("/verify-email", userController.verificationEmail);

router.post("/verify-phone", userController.verificationPhone);

router.patch("/change-password", userController.changePassword);

router.put("/update-all-profile", userController.updateAllUser);

router.patch("/update-profile", userController.updateUser);

router.get("/profile", userController.profile);

router.post("/single-upload", upload.single("file"), FileController.singleUploadForUser);

router.post("/multi-upload", upload.array("files"), FileController.multiUploadForUser);

export default router;
