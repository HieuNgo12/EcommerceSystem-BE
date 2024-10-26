import UsersModel from "../database/models/users.mjs";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import OtpModel from "../database/models/otp.mjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Vonage } from "@vonage/server-sdk";
import multer from "multer";
import streamifier from "streamifier";
// import cloudinary from "../utils/cloudinaryConfig.mjs";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const secretKey = process.env.SECRET_KEY || "mysecretkey";
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

const vonage = new Vonage({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
});

const userController = {
  sendVerificationEmail: async (req, res, next) => {
    try {
      const email = req.user.email;
      const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });
      const arrOtp = {
        otp: otp,
        email: email,
        purpose: "VerificationEmail",
      };
      const newOtp = await OtpModel.create(arrOtp);

      if (!newOtp) throw new Error("Error when creating OTP");

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
            message: error.message,
            message: "error",
            success: false,
          });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).send({
            message: "OTP is sent",
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

  verificationEmail: async (req, res, next) => {
    try {
      const email = req.user.email;
      const { otp } = req.body;

      if (!otp) throw new Error("Otp is required!");

      const maxTime = 5 * 60 * 1000; // 5 phút
      const currentTime = new Date();

      const dataOtp = await OtpModel.findOne({
        otp: otp,
        email: email,
        purpose: "VerificationEmail",
      });

      if (!dataOtp) throw new Error("Otp is incorrect!");

      const counterTime = currentTime - dataOtp.createdAt;

      if (counterTime >= maxTime) throw new Error("OTP is expired!");

      const user = await UsersModel.findOneAndUpdate(
        { email: email },
        { isEmailVerified: true, status: "active" },
        { new: true }
      );

      if (!user) throw new Error("Verification Email failed!");

      return res.status(200).send({
        message: "Verification Email is successful!",
        data: user,
        success: true,
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
      const userId = req.user.id;
      const { phone } = req.body;

      if (!phone) throw new Error("Phone is required");

      const checkId = await UsersModel.findById(userId);

      const checkVerifiedPhone = await UsersModel.findOne({
        _id: userId,
        isPhoneVerified: false,
      });

      if (!checkVerifiedPhone)
        throw new Error("Phone number is already Verified");

      if (!checkId) throw new Error("Phone number is already in use");

      const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });

      const arrOtp = {
        otp: otp,
        phone: phone,
        purpose: "VerificationPhone",
      };

      const newOtp = await OtpModel.create(arrOtp);

      if (!newOtp) throw new Error("OTP not generated!");

      // const formatPhoneNumber = (phone) => {
      //   phone = String(phone);
      //   if (phone.startsWith("0") && !phone.startsWith("+")) {
      //     return "+84" + phone.slice(1);
      //   }
      //   if (!phone.startsWith("+")) {
      //     return "+84" + phone;
      //   }
      //   return phone;
      // };

      // const formattedPhone = formatPhoneNumber(phone);

      const from = "Vonage APIs";
      const to = phone;
      const text = `Your otp is ${otp}`;

      async function sendSMS() {
        await vonage.sms
          .send({ to, from, text })
          .then((resp) => {
            console.log("Sent OTP successfully");
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

  verificationPhone: async (req, res, next) => {
    try {
      const otp = req.body.otp;
      const userId = req.user.id;
      const user = await UsersModel.findById(userId);
      const getOtp = await OtpModel.findOne({ otp: otp });

      const MAX_TIME = 5 * 60 * 1000;
      const currentDate = new Date();
      const timeNow = currentDate - getOtp.createdAt;
      if (timeNow < MAX_TIME) {
        const verifiedPhone = await UsersModel.findByIdAndUpdate(user.id, {
          isPhoneVerified: true,
        });
        if (verifiedPhone) {
          return res.status(200).send({
            message: "Phone number was successfully verified",
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
          message: "Otp is expired!",
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
      const { currentPassword, newPassword, confirmPassword, otp } =
        req.body.values;
      const userId = req.user.id;

      if (!currentPassword) throw new Error("Current Password is required!");
      if (!newPassword) throw new Error("New Password is required!");
      if (!confirmPassword) throw new Error("Confrim Password is required!");
      if (!otp) throw new Error("Current Password is required!");

      const checkUser = await UsersModel.findById(userId);

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      const checkCurrentPassword = await bcrypt.compare(
        currentPassword,
        checkUser.password
      );

      const checkNewPassword = await bcrypt.compare(
        newPassword,
        checkUser.password
      );

      if (!checkCurrentPassword)
        throw new Error(
          "Current Password is wrong! Please check password again!"
        );

      if (checkNewPassword)
        throw new Error("New Password and current password is not match!");

      if (!passwordRegex.test(newPassword))
        throw new Error(
          "Password is invalid. It must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and be at least 8 characters long."
        );

      if (newPassword !== confirmPassword)
        throw new Error("Password and confirm is not match!");

      const getOtp = await OtpModel.findOne({
        otp: otp,
        email: checkUser.email,
        purpose: "ResetPassword",
      });

      if (!getOtp) throw new Error("OTP is wrong!");

      const hashPassword = bcrypt.hashSync(newPassword, saltRounds);

      const updatePassword = await UsersModel.findByIdAndUpdate(
        userId,
        { password: hashPassword },
        { new: true }
      );

      if (updatePassword) {
        return res.status(200).send({
          data: newPassword,
          message: "Change password successful!",
          success: true,
        });
      } else {
        return res.status(403).send("Change password failed");
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
      const secure_url = req.secure_url;
      // const public_id = req.public_id;
      const userId = req.user.id;
      const {
        firstName,
        lastName,
        gender,
        dateOfBirth,
        number,
        ward,
        district,
        city,
        zipcode,
        password,
        idCard,
      } = req.body;

      const userData = {
        firstName,
        lastName,
        gender,
        dateOfBirth,
        zipcode,
        avatar: secure_url,
        address: {
          number,
          ward,
          district,
          city,
        },
        idCard,
      };

      const user = await UsersModel.findOne({ _id: userId });

      // const result = await bcrypt.compare(password, user.password);

      bcrypt.compare(password, user.password).then(async function (result) {
        if (!result) {
          console.log("Password is incorrect! hehehe");
          return;
        }

        const updatedUser = await UsersModel.findByIdAndUpdate(
          userId,
          userData,
          {
            new: true,
          }
        );

        if (!updatedUser) throw new Error("User updated fail!");

        res.status(200).json({
          message: "User updated successfully",
          data: updatedUser,
          success: true,
        });
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
      const userId = req.user.id;
      const checkUserId = await UsersModel.findById(userId);

      if (!checkUserId) {
        res.status(400).json({
          message: "UserId is not found.",
          data: null,
          success: false,
        });
      } else {
        res.status(200).json(checkUserId);
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  sendOtpToChangePassword: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const methodSent = req.body.method;

      if (!methodSent) throw new Error("Please select a method!");

      const checkVerified = await UsersModel.findById(userId);

      if (methodSent === "email") {
        if (checkVerified.isEmailVerified === true) {
          const otp = otpGenerator.generate(6, {
            digits: true,
            alphabets: false,
            upperCase: false,
            specialChars: false,
          });
          const arrOtp = {
            otp: otp,
            email: checkVerified.email,
            purpose: "ResetPassword",
          };

          const newOtp = await OtpModel.create(arrOtp);

          if (!newOtp) throw new Error("Error when creating OTP");

          const mailOptions = {
            from: "info@test.com", // Địa chỉ email gửi
            to: checkVerified.email, // Email người nhận (người dùng)
            subject: "Your OTP Code", // Tiêu đề email
            text: `Your OTP code is: ${otp}`, // Nội dung email
          };

          try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent: " + info.response);
            return res.status(200).send({
              message: "OTP is sent",
              data: info.response,
              success: true,
            });
          } catch (error) {
            console.log("Error sending email:", error);
            return res.status(400).send({
              message: error.message,
              success: false,
            });
          }
        } else {
          throw new Error("Please Verify email!");
        }
      }

      if (methodSent === "phone") {
        if (checkVerified.isPhoneVerified === true) {
          const otp = otpGenerator.generate(6, {
            digits: true,
            alphabets: false,
            upperCase: false,
            specialChars: false,
          });

          const arrOtp = {
            otp: otp,
            phone: checkVerified.phone,
            purpose: "VerificationPhone",
          };

          const newOtp = await OtpModel.create(arrOtp);

          if (!newOtp) throw new Error("OTP not generated!");

          const from = "Vonage APIs";
          const to = checkVerified.phone;
          const text = `Your otp is ${otp}`;

          async function sendSMS() {
            await vonage.sms
              .send({ to, from, text })
              .then((resp) => {
                console.log("Sent OTP successfully");
                console.log(resp);
              })
              .catch((err) => {
                console.log("There was an error sending the messages.");
                console.error(err);
              });
          }

          sendSMS();
        }
      } else {
        throw new Error("Please Verify phone!");
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
