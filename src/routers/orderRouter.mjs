import authenticationController from "../controllers/authenticationController.mjs";
import orderController from "../controllers/orderController.mjs";
import express from "express";

// router.get("/order", authenticationController.isUser, orderController.getOrder);
// router.post("/order", authenticationController.isAdmin, orderController.createOrder);
// router.put("/order", authenticationController.isAdmin,orderController.updateOrder);
const router = express.Router();

router.get(
  "/api/v1/order",
  // authenticationController.isLogin,
  orderController.getOrder
);
router.post(
  "/api/v1/order",
  // authenticationController.isAdmin,
  orderController.createOrder
);
router.patch(
  "/api/v1/order",
  // authenticationController.isAdmin,
  orderController.updateOrder
);
router.post(
  "/api/v1/token",
  // authenticationController.isAdmin,
  orderController.token
);
// router.post("/api/v1/upload", upload.single("file"), (req, res) => {
//   // Truy cập dữ liệu tệp từ req.file
//   const file = req.file;

//   if (!file) {
//     return res.status(400).json({ error: "Không có tệp được tải lên." });
//   }

//   // Trả về phản hồi với thông tin về tệp đã tải lên
//   res.json({ message: "Tệp được tải lên thành công.", data: file });
// });
export default router;
