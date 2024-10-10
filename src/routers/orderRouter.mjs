import authenticationController from "../controllers/authenticationController.mjs";
import orderController from "../controllers/orderController.mjs";

const OrderRouter = (app) => {
  // app.get("/order", authenticationController.isUser, orderController.getOrder);
  // app.post("/order", authenticationController.isAdmin, orderController.createOrder);
  // app.put("/order", authenticationController.isAdmin,orderController.updateOrder);
  app.get("/api/v1/order", 
  // authenticationController.isLogin,
   orderController.getOrder);
  app.post("/api/v1/order", 
  // authenticationController.isAdmin, 
  orderController.createOrder);
  app.put("/api/v1/order", 
  // authenticationController.isAdmin,
  orderController.updateOrder);
  app.post("/api/v1/token", 
  // authenticationController.isAdmin,
  orderController.token);

};
export default OrderRouter;
