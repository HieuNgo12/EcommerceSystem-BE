import DeliveryModel from "../database/models/delivery.mjs";
import OrderModel from "../database/models/order.mjs";
import PaymentModel from "../database/models/payment.mjs";
import ProductModel from "../database/models/product.mjs";
import UsersModel from "../database/models/users.mjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const orderController = {
  getOrder: async (req, res, next) => {
    const limit = Number(req.query.limit);
    const page = req.query.page;
    const query = req.query.query;

    OrderModel.find()
      .populate("paymentId")
      .populate("userId")
      .populate("deliveryId")
      .populate("productId")
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({
        name: "asc",
      })
      // .where(
      //   { productId: { title: query } }
      //   // { $group: { _id: '$customerId', totalAmount: { $sum: '$totalAmount' } } }
      // )
      .then((data) => {
        // console.log("data", data);
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

  getAllOrder: async (req, res, next) => {
    try {
      const getAllOrder = await OrderModel.find()
        // .populate("paymentId")
        .populate(
          "userId",
          "address email firstName lastName phone username gender dateOfBirth"
        )
        .populate("deliveryId")
        .populate("productId", "title price category");

      if (getAllOrder) {
        return res.status(200).send({
          message: "Get Orders Successfully",
          data: getAllOrder,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "ERR_SERVER",
        message: err.message,
        content: null,
      });
    }
  },

  getOrderForUser: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const getAllOrder = await OrderModel.find()
        .populate("paymentId")
        .populate(
          "userId",
          "address email firstName lastName phone username gender dateOfBirth"
        )
        .populate("deliveryId")
        .populate("productId", "title price category");
      console.log(typeof userId);
      console.log(typeof getAllOrder[0].userId._id);
      const filterByUser = getAllOrder.filter(
        (item) => item.userId && String(item.userId._id) === String(userId)
      );

      if (filterByUser) {
        return res.status(200).send({
          message: "Get Orders Successfully",
          data: filterByUser,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "ERR_SERVER",
        message: error.message,
        content: null,
      });
    }
  },

  createOrder: async (req, res) => {
    if (!req.body.body.userEmail) {
      res.status(400).send("Unauthorized");
    }
    try {
      const userData = await UsersModel.findOne({
        email: req.body.body.userEmail,
      });
      const product = await ProductModel.findOne({
        title: req.body.body.productName,
      });
      // console.log( req.body.productName);
      // if (req.body.quantity > product.count) {
      const delivery = await DeliveryModel.create({
        userId: userData._id,
      });

      const payment = await PaymentModel.create({
        userId: userData._id,
        paymentMethod: req.body.body.paymentMethod,
        paymentCard: req.body.body.paymentCard,
      });
      const ref = {
        userId: userData._id,
        paymentId: payment._id,
        deliveryId: delivery._id,
        productId: product?._id ? product?._id : null,
      };
      const body = {
        ...ref,
        ...req.body.body,
      };
      const order = await OrderModel.create(body);
      res.status(200).send({
        status: "OK",
        message: "Added Order Successfully",
        data: order,
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
    const quantity = req.body.quantity;
  },
  cancelOrder: async (req, res) => {
    try {
      const orderId = req.body.orderId;
      const resOrder = await OrderModel.findOne({ _id: orderId })
        .populate("paymentId")
        .populate("deliveryId")
        .populate("productId");
      console.log(resOrder);
      const resDelivery = await DeliveryModel.findOneAndUpdate(
        {
          _id: resOrder?.deliveryId?._id,
        },
        {
          deliveryStatus: "Cancelled",
          cancelDate: Date.now(),
        }
      );
      const resPayment = await PaymentModel.findOneAndUpdate(
        {
          _id: resOrder?.paymentId?._id,
        },
        {
          status: "Failed",
        }
      );
      const user = UsersModel.findById(resOrder.userId);
      return res.status(200).send({
        status: "OK",
        message: "Cancel Order Successfully",
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

  emailForCustomer: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { text, summary } = req.body;
      const file = req.file;
      console.log(req.file);
      if (!summary) {
        return res.status(400).json({
          message: "summary is required.",
        });
      }
      if (!text) {
        return res.status(400).json({
          message: "Text is required.",
        });
      }

      const checkEmail = await UsersModel.findById(userId);

      if (!checkEmail) {
        res.status(400).json({
          message: "User is not found!",
        });
      }

      //nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.PASS_EMAIL,
        },
      });

      const mailOptions = {
        from: {
          name: "Customer Service",
          address: process.env.MY_EMAIL,
        },
        to: [checkEmail.email],
        subject: summary,
        text: text,
        attachments: [
          {
            filename: file.originalname, // Tên file gốc
            content: file.buffer, // Nội dung file từ `buffer` của multer
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);

      if (info) {
        res.status(200).json({
          message: "Success",
        });
      } else {
        res.status(400).json({
          message: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Error",
      });
    }
  },

  updateDeliverOrder: async (req, res, next) => {
    try {
      const orderId = req.params.orderId;

      const checkOrder = await OrderModel.findById(orderId, req.body);

      if (!checkOrder) {
        res.status(400).json({
          message: "Order is not found!",
        });
      }

      const update = await OrderModel.findByIdAndUpdate(orderId, req.body);

      if (update) {
        res.status(200).json({
          message: "Upate is successful!",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Error",
      });
    }
  },
};

export default orderController;
