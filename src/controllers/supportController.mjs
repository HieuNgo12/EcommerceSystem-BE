import ReviewModel from "../database/models/review.mjs";
import ProductModel from "../database/models/product.mjs";
import UsersModel from "../database/models/users.mjs";
import SupportModel from "../database/models/support.mjs";
import nodemailer from "nodemailer";

const supportController = {
  addSupport: async (req, res) => {
    try {
      const support = await SupportModel.create(req.body);
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
          name: "Exclusive",
          address: process.env.MY_EMAIL,
        },
        to: [req.body.email],
        subject: "Thank you for using Exclusive!",
        text: "Your message will be processed soon. We will support you in at least 3 business days",
        html: `<b>Your request</b> <div>${req.body.message}</div>`
      };
      const info = await transporter.sendMail(mailOptions);
      console.log(info);
      res.status(200).send({
        data: support,
        message: "Success",
      });
    } catch (e) {
      console.log(e);
    }
  },
};

export default supportController;
