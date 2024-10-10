import authenticationController from "../controllers/authenticationController.mjs";
import orderController from "../controllers/orderController.mjs";

const OrderRouter = (app) => {
  app.get("/order", orderController.getOrder);
  app.post("/order", orderController.createOrder);
  app.put("/order",orderController.updateOrder);

};
export default OrderRouter;
