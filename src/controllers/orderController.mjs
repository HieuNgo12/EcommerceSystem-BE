import OrderModel from "../database/models/order.mjs";
import ProductModel from "../database/models/product.mjs";
import UsersModel from "../database/models/users.mjs";

const orderController = {
  getOrder: async (req, res, next) => {
    OrderModel.find()
      .populate("items.item")
      .populate("userId")
      .then((data) => {
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
      console.log(req.body);
  
      const token = req.header("Authorization")[1];
      const tokenData = jwt.verify(
        token,
        process.env.SECRET_TOKEN || "secret-key"
      );
        console.log(tokenData);
      const order = OrderModel.create(req.body, { user: tokenData.username });
      UsersModel.findOneAndUpdate({ username: tokenData.username }, order);

      const resOrder = await order.save();
      const user = await UsersModel.findById(resOrder.userId);
      // pushNotification(user.pushTokens, content, "");
      // transporter.sendMail(sendUserOrderTemplate(resOrder, user), (err, info) => {
      //   if (err) {
      //     res.status(500).send({ err: "Error sending email" });
      //   } else {
      //     console.log(`** Email sent **`, info);
      //   }
      // });
      res.status(200).send({
        status: "OK",
        message: "Added Order Successfully",
        data: resOrder,
      });
    } catch (err) {
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
};
export default orderController;
