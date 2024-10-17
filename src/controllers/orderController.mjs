import DeliveryModel from "../database/models/delivery.mjs";
import OrderModel from "../database/models/order.mjs";
import PaymentModel from "../database/models/payment.mjs";
import ProductModel from "../database/models/product.mjs";
import UsersModel from "../database/models/users.mjs";
import jwt from "jsonwebtoken";
const orderController = {
  getOrder: async (req, res, next) => {
    const limit = req.query.limit;
    const page = req.query.page;
    const query = req.query.query;
    OrderModel.find()
      .populate("paymentId")
      // .populate("userId")
      .populate("deliveryId")
      .populate("productId")
      .limit(limit)
      .skip(limit * page)
      .sort({
        name: "asc",
      })
      // .where(
      //   { productId: { title: query } }
      //   // { $group: { _id: '$customerId', totalAmount: { $sum: '$totalAmount' } } }
      // )
      .then((data) => {
        console.log(data);
        return res.status(200).send({
          status: "OK",
          message: "Get Orders Successfully",
          content: data,
        });
      })
      .catch((err) => {
        return res.status(400).send({
          status: "ERR_SERVER",
          message: err.message,
          content: null,
        });
      });
  },
  createOrder: async (req, res) => {
    try {
      const userData = {
        _id: "123",
        username: "john_doe",
        role: "user",
      };
      const token = jwt.sign(userData, "secret-key", { expiresIn: "1h" });
      console.log(req.body);
      // Xác thực JWT
      jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err) {
          console.error("JWT verification failed:", err.message);
        } else {
          console.log("Decoded JWT:");
          console.log(decoded);
          const product = await ProductModel.findOne({
            title: req.body.body.productName,
          });
          // console.log( req.body.productName);
          // if (req.body.quantity > product.count) {
          const delivery = await DeliveryModel.create({
            userId: decoded._id,
          });

          const payment = await PaymentModel.create({
            userId: decoded._id,
          });
          const ref = {
            userId: decoded._id,
            paymentId: payment._id,
            deliveryId: delivery._id,
            productId: product?._id ? product?._id : null,
          };
          const body = {
            ...ref,
            ...req.body.body,
          };
          const order = await OrderModel.create(body);
          console.log(order);
          res.status(200).send({
            status: "OK",
            message: "Added Order Successfully",
            data: order,
          });
          // } else {
          //   res.status(401).send({
          //     status: "Not Ok",
          //     message: "Unable to add Order due to limitted products",
          //     data: order,
          //   });
          // }
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        status: "ERR_SERVER",
        message: err.message,
        data: null,
      });
    }
  },
  updateOrder: async (req, res) => {
    const { id } = req.params;
    const updateStatus = req.body.status;
    if (!req.params.id) {
      return res.status(200).send({
        status: "ERR_REQUEST",
        message: "Please check your ID request",
        content: null,
      });
    }
    // let content = {
    //   title: "Cập nhật đơn hàng",
    //   body: `Đơn hàng ${id.substr(id.length - 10)} đã được ${updateStatus}.`,
    // };
    try {
      const resOrder = await OrderModel.findByIdAndUpdate(id, {
        status: updateStatus,
      });
      const user = UsersModel.findById(resOrder.userId);
      // pushNotification(user.pushTokens, content, "");
      return res.status(200).send({
        status: "OK",
        message: "Updated Order Successfully",
        content: resOrder,
      });
    } catch (err) {
      return res.status(400).send({
        status: "ERR_SERVER",
        message: err.message,
        content: err,
      });
    }
  },
  token: async (req, res) => {
    try {
      const userData = {
        id: "123",
        username: "john_doe",
        role: "user",
      };
      const token = jwt.sign(userData, "secret-key", { expiresIn: "1h" });

      // Xác thực JWT
      jwt.verify(token, "secret-key", (err, decoded) => {
        if (err) {
          console.error("JWT verification failed:", err.message);
        } else {
          console.log("Decoded JWT:");
          console.log(decoded);
        }
      });
      res.status(200).send({ data: token });
    } catch (e) {
      console.log(e);
    }
  },
};
export default orderController;
