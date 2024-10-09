import authenticationController from "../controllers/authenticationController.mjs";
import orderController from "../controllers/orderController.mjs";

const OrderRouter = (app) => {
  app.get("/api/v1/order", 
  // authenticationController.isLogin,
   orderController.getOrder);
  app.post("/api/v1/order", 
  // authenticationController.isAdmin, 
  orderController.createOrder);
  app.put("/api/v1/order", 
  // authenticationController.isAdmin,
  orderController.updateOrder);

};
export default OrderRouter;
