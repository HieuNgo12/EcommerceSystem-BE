import ReviewModel from "../database/models/review.mjs";
import ProductModel from "../database/models/product.mjs";
import UsersModel from "../database/models/users.mjs";
import SupportModel from "../database/models/support.mjs";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

const supportController = {
  addSupport: async (req, res) => {
    try {
      const file = req.file;
      const support = await SupportModel.create(req.body);

      if (file) {
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;

        cloudinary.uploader.upload(
          dataUrl,
          {
            public_id: support._id,
            resource_type: "auto",
            folder: "support",
            overwrite: true,
          },
          async (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "File upload failed.", details: err });
            }

            if (result) {
              const updateImages = await SupportModel.findByIdAndUpdate(
                support._id,
                { image: result.secure_url },
                { new: true }
              );

              const imageCid = `image-${support._id}`;

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
                attachments: [
                  {
                    filename: "logo.png",
                    path: result.secure_url,
                    cid: imageCid,
                  },
                ],
                subject: "Thank you for using Exclusive!",
                html: `<b>Your request</b><img src="cid:${imageCid}" /> <div>${req.body.message}</div><div></div>Your message will be processed soon. We will support you in at least 3 business days</div>`,
              };
              const info = await transporter.sendMail(mailOptions);

              res.status(200).send({
                data: updateImages,
                message: "Success",
              });
            }
          }
        );
      } else {
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
          html: `<b>Your request</b> <div>${req.body.message}</div><div></div>Your message will be processed soon. We will support you in at least 3 business days</div>`,
        };
        const info = await transporter.sendMail(mailOptions);

        res.status(200).send({
          data: support,
          message: "Success",
        });
      }
    } catch (e) {
      console.log(e);
    }
  },

  getSupport: async (req, res) => {
    try {
      const getSupport = await SupportModel.find().populate(
        "reply.adminId",
        "email"
      );

      if (getSupport) {
        res.status(200).json({
          data: getSupport,
          message: "Success",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Error",
      });
    }
  },

  getSupportByEmail: async (req, res) => {
    try {
      const email = req.user.email;
      const getSupport = await SupportModel.findOne({ email: email });
      if (getSupport) {
        res.status(200).json({
          data: getSupport,
          message: "Success",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Error",
      });
    }
  },

  replyCustomer: async (req, res) => {
    try {
      const adminId = req.user.id;
      const supportId = req.params.supportId;
      const { text, summary } = req.body;

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

      const support = await SupportModel.findById(supportId);

      if (support) {
        support.reply = {
          ...support.reply,
          adminId: adminId,
          timeReply: new Date(),
          statusReply: "true",
          text: text,
        };
        await support.save();
      }

      if (!support) {
        res.status(400).json({
          message: "Fail",
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
          name: "Reply",
          address: process.env.MY_EMAIL,
        },
        to: [support.email],
        subject: summary,
        text: text,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Your Request</h2>
            <p><b>Message:</b> ${support.message}</p>
      
            <h2>Our Response</h2>
            <p><b>Response:</b> ${text}</p>
      
            <br>
            <p>Thank you for reaching out to us. If you have further questions, please feel free to reply to this email.</p>
            <p>Best regards,<br>Support Team</p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);

      if (info) {
        res.status(200).json({
          data: support,
          message: "Success",
        });
      } else {
        res.status(200).json({
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

  editSupport: async (req, res) => {
    try {
      const supportId = req.params.supportId;
      const { note, status } = req.body;

      console.log(status);
      console.log(note);
      const support = await SupportModel.findById(supportId);

      if (support) {
        support.reply = {
          ...support.reply,
          note: note,
        };
        support.status = status;
        await support.save();
        res.status(200).json({
          data: support,
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

  deleteSupport: async (req, res) => {
    try {
      const supportId = req.params.supportId;
      const support = await SupportModel.findByIdAndDelete(supportId);

      if (support) {
        res.status(200).json({
          message: "Delete support successful!",
        });
      } else {
        res.status(200).json({
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
};

export default supportController;
