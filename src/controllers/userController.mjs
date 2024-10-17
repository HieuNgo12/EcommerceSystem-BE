import UsersModel from "../database/models/users.mjs";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import OtpModel from "../database/models/otp.mjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Vonage from "@vonage/server-sdk";
import multer from "multer";
import streamifier from "streamifier";
// import cloudinary from "../utils/cloudinaryConfig.mjs";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const saltRounds = 10;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false,
  port: 587,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.PASS_EMAIL,
  },
});

const userController = {
  sendVerificationEmail: async (req, res, next) => {
    try {
      const email = req.user.email;
      const otp = otpGenerator.generate(6, { digits: true });
      const arrOtp = {
        otp: otp,
        email: email,
        purpose: "VerificationEmail",
      };
      const newOtp = await OtpModel.create(arrOtp);
      const currentDate = new Date();

      const mailOptions = {
        from: "info@test.com", // Địa chỉ email gửi
        to: email, // Email người nhận (người dùng)
        subject: "Your OTP Code", // Tiêu đề email
        text: `Your OTP code is: ${otp}`, // Nội dung email
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          return res.status(400).send({
            message: "error",
            success: false,
          });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).send({
            message: "otp is sent",
            data: info.response,
            success: true,
          });
        }
      });
    } catch (error) {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  sendVerificationPhone: async (req, res, next) => {
    try {
      const id = req.user.id;
      const { phone } = req.body;

      if (!phone) throw new Error("phone is required");

      const checkId = await UsersModel.findById(id);

      if (checkId.phone !== phone) {
        return res.status(403).send({
          message: "Số điện thoại không đúng",
          data: null,
          success: false,
        });
      }

      const otp = otpGenerator.generate(6, { digits: true });

      const arrOtp = {
        otp: otp,
        phone: phone,
        purpose: "VerificationPhone",
      };

      const newOtp = await OtpModel.create(arrOtp);

      if (!newOtp) {
        return res.status(403).send({
          message: "Không thể tạo Otp",
          data: null,
          success: false,
        });
      }

      const formatPhoneNumber = (phone) => {
        phone = String(phone);
        if (phone.startsWith("0") && !phone.startsWith("+")) {
          return "+84" + phone.slice(1);
        }
        if (!phone.startsWith("+")) {
          return "+84" + phone;
        }
        return phone;
      };

      const formattedPhone = formatPhoneNumber(phone);

      const vonage = new Vonage({
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET,
      });

      const from = "Vonage APIs";
      const to = formattedPhone;
      const text = `Your otp is ${otp}`;

      async function sendSMS() {
        await vonage.sms
          .send({ to, from, text })
          .then((resp) => {
            console.log("Message sent successfully");
            console.log(resp);
          })
          .catch((err) => {
            console.log("There was an error sending the messages.");
            console.error(err);
          });
      }

      sendSMS();
    } catch (error) {
      console.error("Twilio error:", error);
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  verificationEmail: async (req, res, next) => {
    try {
      const email = req.user.email;
      let { otp } = req.body;

      if (!otp) throw new Error("vui lòng nhập otp");

      const maxTime = 5 * 60 * 1000; // 5 phút
      const currentTime = new Date();

      const dataOtp = await OtpModel.findOne({
        otp: otp,
        email: email,
        purpose: "VerificationEmail",
      });

      if (!dataOtp) {
        return res.status(403).send({
          message: "otp hoặc email không đúng",
          data: null,
          success: false,
        });
      }

      const counterTime = currentTime - dataOtp.createdAt;

      if (counterTime >= maxTime) {
        return res.status(403).send({
          message: "otp đã hết hạn",
          data: null,
          success: false,
        });
      }

      const user = await UsersModel.findOneAndUpdate(
        { email: email },
        { isEmailVerified: true, status: "active" },
        { new: true }
      );

      if (user) {
        return res.status(200).send({
          message: "xác thực thành công",
          data: user,
          success: true,
        });
      } else {
        return res.status(403).send({
          message: "xác thực thất bại",
          data: null,
          success: false,
        });
      }
    } catch (error) {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  verificationPhone: async (req, res, next) => {
    try {
      const otp = req.body.otp;
      const userId = req.user.id;
      const user = await UsersModel.findById(userId);
      const getOtp = await OtpModel.findOne({ otp: otp });

      console.log(getOtp);
      const MAX_TIME = 5 * 60 * 1000;
      const currentDate = new Date();
      const timeNow = currentDate - getOtp.createdAt;
      if (timeNow < MAX_TIME) {
        const verifiedPhone = await UsersModel.findByIdAndUpdate(user.id, {
          isPhoneVerified: true,
        });
        if (verifiedPhone) {
          return res.status(200).send({
            message: "xác nhận số điện thoại thành công",
            success: true,
          });
        } else {
          return res.status(403).send({
            message: error.message,
            data: null,
            success: false,
          });
        }
      } else {
        return res.status(403).send({
          message: "otp hết hạn",
          data: null,
          success: false,
        });
      }
    } catch (error) {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { password } = req.body;
      const tokenUser = req.user.id;

      console.log(tokenUser);
      if (!password) throw new Error("password is required!");

      const checkUser = await UsersModel.findById(tokenUser);

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      const isMatch = bcrypt.compare(password, checkUser.password);

      if (!checkUser) {
        return res.status(403).send("account does not exist");
      } else {
        if (isMatch) {
          return res
            .status(403)
            .send("password mới không được trùng với password cũ");
        } else {
          if (!passwordRegex.test(password)) {
            return res.status(403).send({
              message:
                "Password is invalid. It must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and be at least 8 characters long.",
              data: null,
              success: false,
            });
          } else {
            const hashPassword = bcrypt.hashSync(password, saltRounds);
            const newPassword = await UsersModel.findByIdAndUpdate(
              tokenUser,
              { password: hashPassword },
              { new: true }
            );
            if (newPassword) {
              return res.status(200).send({
                data: newPassword,
                message: "change password successful!",
                success: true,
              });
            } else {
              return res.status(403).send("change password failed");
            }
          }
        }
      }
    } catch (error) {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const userData = req.body;

      const updatedUser = await UsersModel.findByIdAndUpdate(userId, userData, {
        new: true,
      });
      res.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  updateAllUser: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const userData = req.body;

      const updatedUser = await UsersModel.findByIdAndUpdate(userId, userData, {
        new: true,
        overwrite: true,
      });
      res.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  profile: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const checkUserId = UsersModel.findById(userId);

      if (!checkUserId) {
        res.status(400).json({
          message: "không tìm thấy userId",
          data: null,
          success: false,
        });
      } else {
        res.status(200).json({
          data: checkUserId,
          success: true,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
};
export default userController;
