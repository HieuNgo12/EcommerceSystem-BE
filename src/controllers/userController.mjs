import UsersModel from "../database/models/users.mjs";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import otpGenerator from "otp-generator";
import OtpModel from "../database/models/otp.mjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const saltRounds = 10;

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api", // Thay bằng email của bạn
    pass: "cad2bc414a23600f1642f31601ca54c1", // Thay bằng mật khẩu của bạn
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

  sendVerificationPhone: async (req, res, next) => {},

  verificationEmail: async (req, res, next) => {
    try {
      const email = req.user.email;
      let { otp } = req.body;

      if (!otp) throw new Error("vui lòng nhập otp");
      else {
        otp = otp.trim();
      }

      const maxTime = 5 * 60 * 1000;
      const currentTime = new Date();

      const dataOtp = await OtpModel.findOne(
        {
          otp: otp,
          email: email,
          purpose: "VerificationEmail"
        }
      );
      

      console.log(dataOtp);

      const counterTime = currentTime - dataOtp.createdAt;

      if (counterTime < maxTime) {
        if (dataOtp) {
          const user = UsersModel.findOneAndUpdate({ isEmailVerified: true });
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
        } else {
          return res.status(403).send({
            message: "otp hoặc email không đúng",
            data: null,
            success: false,
          });
        }
      } else {
        return res.status(403).send({
          message: "otp đã hết hạn",
          data: null,
          success: false,
        });
      }
    } catch (error) {
      return res.status(403).send({
        message: "lỗi",
        data: null,
        success: false,
      });
    }
  },

  verificationPhone: async (req, res, next) => {},

  updateUser: (req, res, next) => {},

  deleteUser: (req, res, next) => {},

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
};
export default userController;
