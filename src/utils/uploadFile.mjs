import express from "express";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import FileController from "../controllers/fileController.mjs";

// Khởi tạo tùy chọn lưu trữ memoryStorage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/single-upload", upload.single("file"), FileController.singleUploadForUser);

router.post("/multi-upload", upload.array("files"), FileController.multiUploadForUser);


export default router;
