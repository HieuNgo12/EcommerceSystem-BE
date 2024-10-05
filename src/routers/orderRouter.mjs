import authenticationController from "../controllers/authenticationController.mjs";
import orderController from "../controllers/orderController.mjs";

const OrderRouter = (app) => {
  app.get("/order", authenticationController.isUser, orderController.getOrder);
  app.post("/order", authenticationController.isAdmin, orderController.createOrder);
  app.put("/order", authenticationController.isAdmin,orderController.updateOrder);
  app.delete("/order/:orderId",authenticationController.isAdmin, orderController.deleteOrder);

};
export default OrderRouter;
