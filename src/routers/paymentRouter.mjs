import authenticationController from "../controllers/authenticationController.mjs";
import paymentController from "../controllers/paymentController.mjs";

const PaymentRouter = (app) => {
  app.get(
    "api/v1/payment",
    //  authenticationController.isLogin,
    paymentController.getPayment
  );
  app.post(
    "api/v1/payment",
    authenticationController.isAdmin,
    paymentController.postPayment
  );
  app.put(
    "api/v1/payment",
    authenticationController.isAdmin,
    paymentController.updatePayment
  );
  // app.delete("/payment/:paymentId",authenticationController.isAdmin, paymentController.deletePayment);
  app.delete("api/v1/payment/", paymentController.deleteAllPayments);

  app.post("/paymentData", paymentController.createPaymentData);
};
export default PaymentRouter;
