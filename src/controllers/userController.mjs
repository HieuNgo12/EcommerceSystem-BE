import UsersModel from "../database/models/users.mjs";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import OtpModel from "../database/models/otp.mjs";
import nodemailer from "nodemailer";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.ACCOUNT_SID; // Thay bằng Account SID của bạn
const authToken = process.env.AUTH_TOKEN; // Thay bằng Auth Token của bạn
const myMail = process.env.MY_EMAIL;
const passMyMail = process.env.PASS_EMAIL;
const client = twilio(accountSid, authToken);
const saltRounds = 10;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false,
  port: 587,
  auth: {
    user: myMail,
    pass: passMyMail,
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

      const mailOptions = {
        from: "info@test.com", // Địa chỉ email gửi
        to: email, // Email người nhận (người dùng)
        subject: "Your OTP Code", // Tiêu đề email
        text: `Your OTP code is: ${otp}`, // Nội dung email
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      if (newOtp) {
        return res.status(200).send({
          message: "otp is sent",
          data: newOtp,
          success: true,
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

  sendVerificationPhone: async (req, res, next) => {
    try {
      const id = req.user.id;
      const { phone } = req.body;

      if (!phone) throw new Error("phone is required");
      const checkId = await UsersModel.findById(id);
      console.log(checkId);

      if (checkId.phone !== phone) {
        return res.status(403).send({
          message: "số điện không đúng",
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
      const formatPhoneNumber = (phone) => {
        phone = String(phone);
        // Nếu số điện thoại bắt đầu bằng '0' nhưng không có dấu '+'
        if (phone.startsWith("0") && !phone.startsWith("+")) {
          return "+84" + phone.slice(1); // Thay '0' bằng mã quốc gia '+84'
        }
        // Nếu số điện thoại không bắt đầu bằng '0' nhưng cũng không có dấu '+'
        if (!phone.startsWith("+")) {
          return "+84" + phone; // Thêm mã quốc gia Việt Nam nếu thiếu
        }
        return phone; // Giữ nguyên số điện thoại nếu đã có mã quốc gia
      };

      // Sử dụng hàm formatPhoneNumber trước khi gửi OTP
      const formattedPhone = formatPhoneNumber(phone);

      console.log(newOtp);
      const message = await client.messages.create({
        from: "+13343397546", // Số điện thoại Twilio của bạn
        to: "+84 98 567 16 78", // Số điện thoại người nhận (bao gồm mã quốc gia)
        body: `Your verification code is ${otp}`, // Nội dung tin nhắn chứa mã OTP
      });

      console.log(`Message SID: ${message.sid}`);
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
      const email = req.user.email; // Lấy email từ người dùng đã đăng nhập
      let { otp } = req.body;

      if (!otp) throw new Error("vui lòng nhập otp");

      const maxTime = 5 * 60 * 1000; // 5 phút
      const currentTime = new Date();

      // Tìm OTP trong cơ sở dữ liệu
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
  updateUser: async (req, res, next) => {
    try {
      const { userName, email, address, firstName, lastName, newPassword } =
        req.body;
      if (!userName) throw new Error("userName is required!");
      if (!email) throw new Error("email is required!");

      const createdUser = await UsersModel.updateOne({
        userName,
        email,
        address,
        firstName,
        lastName,
        password: newPassword,
      });
      res.status(201).send({
        data: createdUser,
        message: "Register successful!",
        success: true,
      });
    } catch (error) {
      res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  verificationPhone: async (req, res, next) => {},

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
};
export default userController;
