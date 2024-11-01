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

router.post("/check-admin", AdminController.checkAdmin); 

router.post("/logout", authenticationController.logout); 

router.post("/signup",  upload.single("file"), AdminController.registerByAdmin); //ok

router.post("/get-users", AdminController.getUsers); //ok

router.post("/get-admin-users", AdminController.getAdminUsers); //ok

router.put("/update-all-profile/:userId", AdminController.updateAllUser); 

router.patch("/update-profile/:userId", upload.single("file"), FileController.singleUpdateForUserByAdmin, AdminController.updateUser); //ok

router.delete("/user-delete/:userId", AdminController.deleteUser); //ok

router.patch("/update-admin/:userId" , upload.single("file"), validate.auhthorizationSuper, AdminController.updateAdmin )

router.post("/single-upload", upload.single("file"), FileController.singleUploadForUser);

router.post("/multi-upload", upload.array("files"), FileController.multiUploadForUser);

export default router;
