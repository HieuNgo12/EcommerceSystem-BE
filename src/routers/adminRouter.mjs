import express from "express";
import userController from "../controllers/userController.mjs";
import AdminController from "../controllers/adminController.mjs";
import authenticationController from "../controllers/authenticationController.mjs";
import FileController from "../controllers/fileController.mjs";
import multer from "multer";
import  validate  from "../utils/validate.mjs";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/logout", authenticationController.logout);

router.post("/get-users", AdminController.getUsers);

router.put("/update-all-profile/:userId", upload.single("file"), FileController.singleUploadForUpdateUser, AdminController.updateAllUser);

router.patch("/update-profile/:userId", AdminController.updateUser);

router.delete("/user-delete/:userId", AdminController.deleteUser);

router.post("/single-upload", upload.single("file"), FileController.singleUploadForUser);

router.post("/multi-upload", upload.array("files"), FileController.multiUploadForUser);


export default router;
