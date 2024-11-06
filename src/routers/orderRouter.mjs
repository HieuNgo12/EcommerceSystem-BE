import validate from "../utils/validate.mjs";
import authenticationController from "../controllers/authenticationController.mjs";
import couponController from "../controllers/couponController.mjs";
import FileController from "../controllers/fileController.mjs";
import orderController from "../controllers/orderController.mjs";
import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// router.get("/order", authenticationController.isUser, orderController.getOrder);
// router.post("/order", authenticationController.isAdmin, orderController.createOrder);
// router.put("/order", authenticationController.isAdmin,orderController.updateOrder);
const router = express.Router();

// Hòa
router.get(
  "/api/v1/get-all-order",
  validate.authentication,
  validate.auhthorizationAdmin,
  orderController.getAllOrder
);

router.post(
  "/api/v1/email/:userId",
  validate.authentication,
  validate.auhthorizationAdmin,
  upload.single("file"),
  orderController.emailForCustomer
);

router.patch(
  "/api/v1/update-order/:orderId",
  validate.authentication,
  validate.auhthorizationAdmin,
  orderController.updateDeliverOrder
);

router.get(
  "/api/v1/get-order/:userId",
  validate.authentication,
  orderController.getOrderForUser
);

// Hiếu
router.get(
  "/api/v1/order",
  authenticationController.isLogin,
  orderController.getOrder
);

router.post("/api/v1/order", orderController.createOrder);

router.patch(
  "/api/v1/order",
  authenticationController.isAdmin,
  orderController.updateOrder
);

router.post(
  "/api/v1/token",
  authenticationController.isAdmin,
  orderController.token
);

router.post("/api/v1/order/cancelOrder", orderController.cancelOrder);
router.post("/api/v1/coupon", couponController.createCouponData);
router.get("/api/v1/coupon", couponController.getCoupon);

// router.post("/api/v1/order/multi-upload", upload.array("files"), FileController.multiUploadForUser);

export default router;
