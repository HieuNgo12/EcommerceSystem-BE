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

router.post("/send-verification-email", userController.sendVerificationEmail); //ok
 
router.post("/verify-email", userController.verificationEmail); //ok

router.post("/send-verification-phone", userController.sendVerificationPhone); //ok

router.post("/verify-phone", userController.verificationPhone); //ok

router.patch("/change-password", userController.changePassword); //ok

router.post("/send-otp-change-password", userController.sendOtpToChangePassword); //ok

router.put("/update-all-profile", userController.updateAllUser); 

router.patch("/update-profile", upload.single("file"), FileController.singleUpdateForUser, userController.updateUser); //ok

router.post("/profile", userController.profile); //ok

router.post("/single-upload", upload.single("file"), FileController.singleUploadForUser);

router.post("/multi-upload", upload.array("files"), FileController.multiUploadForUser);



export default router;
