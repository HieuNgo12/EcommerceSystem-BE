import UsersModel from "../database/models/users.mjs";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import otpGenerator from "otp-generator";
import OtpModel from "../database/models/otp.mjs";
import jwt from "jsonwebtoken";
const SECRET_KEY = "your_secret_key";
import validator from "validator";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import redis from "redis";
import cookieParser from "cookie-parser";
import { jwtDecode } from "jwt-decode";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

//jwt
const secretKey = process.env.SECRET_KEY || "mysecretkey";
const saltRounds = 10;
// const client = redis.createClient();

// nodemailder
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false,
  port: 587,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.PASS_EMAIL,
  },
});

//check redis connection
// client.on("error", (err) => {
//   console.error("Error connecting to Redis", err);
// });

const authenticationController = {
  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      if (!email) throw new Error("Email is required!");
      else {
        email = email.trim();
      }
      if (!password) throw new Error("password is required!");
      // else {
      //   password = password.trim();
      // }

      const checkEmail = await UsersModel.findOne({
        email: email,
      });

      if (!checkEmail) throw new Error("Email is incorrect");

      bcrypt
        .compare(password, checkEmail.password)
        .then(async function (result) {
          // result == true
          if (result && checkEmail) {
            const userData = {
              id: checkEmail.id,
              username: checkEmail.username,
              email: checkEmail.email,
              isEmailVerified: checkEmail.isEmailVerified,
              role: checkEmail.role,
            };

            const accessToken = jwt.sign(userData, secretKey, {
              expiresIn: "1m",
            });

            const refreshToken = jwt.sign(userData, secretKey, {
              expiresIn: "365d",
            });

            // await client.connect();

            // client.set(refreshToken, 30 * 24 * 60 * 60, JSON.stringify(userData)); // 30 ngày

            // res.cookie("refreshToken", refreshToken, {
            //   httpOnly: true,
            //   secure: true,
            //   path: "/",
            //   sameSite: "None",
            //   maxAge: 3600000,
            // });

            // res.cookie("accessToken", accessToken, {
            //   httpOnly: true,
            //   secure: true,
            //   path: "/",
            //   sameSite: "None",
            //   maxAge: 60,
            // });

            return res.status(200).send({
              accessToken: accessToken,
              refreshToken: refreshToken,
              message: "Login successful!",
              success: true,
            });
          } else {
            res.status(400).send({
              message: "Password is incorrect",
              data: null,
              success: false,
            });
          }
        });
    } catch (error) {
      return res.status(400).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  // refreshToken: async (req, res, next) => {
  //   try {
  //     const refreshToken = req.cookie.refreshToken;
  //     // console.log(refreshToken);

  //     // return res.status(200).send(refreshToken)
  //     if (!refreshToken) throw new Error("You are not authenticated.");
  //     const decoded = jwtDecode(refreshToken);
  //     console.log(decoded);
  //     jwt.verify(refreshToken, secretKey, (err, user) => {
  //       if (err) {
  //         console.log(err);
  //       }

  //       const userData = {
  //         id: user.id,
  //         email: user.email,
  //         role: user.role,
  //       };

  //       const newAccesstoken = jwt.sign(userData, secretKey, {
  //         expiresIn: "1h",
  //       });

  //       const newRefreshToken = jwt.sign(userData, secretKey);

  //       res.cookie("refreshToken", newRefreshToken, {
  //         httpOnly: true, // Cookie không thể truy cập qua JavaScript (bảo mật hơn)
  //         secure: false, // Sử dụng HTTPS trong production
  //         path: "/",
  //         sameSite: "None", // Cần thiết nếu frontend và backend ở các domain khác nhau
  //         maxAge: 3600000, // Thời hạn cookie 1 giờ
  //       });

  //       res.status(200).json({ data: newAccesstoken });
  //     });
  //   } catch (error) {
  //     return res.status(400).send({
  //       message: error.message,
  //       data: null,
  //       success: false,
  //     });
  //   }
  // },

  refreshToken: async (req, res) => {
    try {
      const token =
        req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1];
      const decoded = jwtDecode(token);
      const dateNow = new Date();

      //token exprire
      if (decoded.exp < dateNow.getTime() / 1000) {
        const newToken = jwt.sign(
          {
            id: decoded.id,
            email: decoded.email,
            isEmailVerified: decoded.isEmailVerified,
            role: decoded.role,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({ accessToken: newToken });
      } else {
        res.json({ accessToken: token });
      }
    } catch (error) {
      return res.status(400).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  register: async (req, res, next) => {
    try {
      let { username, email, password, confirm } = req.body;
      if (!username) throw new Error("Username is required!");
      else {
        username = username.trim();
      }
      const checkUserNameHasAdminWord = email.includes("admin");
      if (checkUserNameHasAdminWord)
        throw new Error("Username does not include admin");

      const checkUserName = await UsersModel.findOne({ username });
      if (checkUserName) throw new Error("Username already exists");

      if (!email) throw new Error("Email is required!");
      else {
        email = email.trim();
      }
      if (!validator.isEmail(email)) throw new Error("Invalid email");

      const checkEmailHasAdminWord = email.includes("admin");
      if (checkEmailHasAdminWord)
        throw new Error("Email does not include admin");

      const checkEmail = await UsersModel.findOne({ email });

      if (checkEmail) throw new Error("Email already exists");

      if (!password) throw new Error("Password is required!");
      // else {
      //   password = password.trim();
      // }

      // Kiểm tra password có đúng định dạng không (ít nhất 1 chữ hoa, 1 chữ thường, 1 số, và ít nhất 8 ký tự)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!passwordRegex.test(password))
        throw new Error(
          "Password is invalid. It must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and be at least 8 characters long."
        );

      if (!confirm) throw new Error("Confirm is required!");
      else {
        confirm = confirm.trim();
      }
      if (confirm == password) {
        bcrypt.hash(password, saltRounds, async (err, hashPassword) => {
          if (err) {
            return res.status(500).send({
              message: "Error hashing password",
              data: null,
              success: false,
            });
          }

          const createdUser = await UsersModel.create({
            username,
            email,
            password: hashPassword,
          });

          return res.status(201).send({
            data: createdUser,
            message: "Register successful!",
            success: true,
          });
        });
      }
    } catch (error) {
      return res.status(400).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  logout: async (req, res, next) => {
    try {
      res.clearCookie("token");
      return res.status(200).send({
        message: "Logout successful",
        success: true,
      });
    } catch (error) {
      console.error("Logout failed:", error.message);
      return res.status(500).send({
        message: "Logout failed",
        success: false,
      });
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      let { email } = req.body;
      if (!email) throw new Error("Email is required!");
      else {
        email = email.trim();
      }

      if (!validator.isEmail(email)) throw new Error("Invalid Email");

      const checkEmail = await UsersModel.findOne({ email: email });

      if (!checkEmail) throw new Error("Email has not been used!");

      const checkVerified = await UsersModel.findOne({
        email: email,
        isEmailVerified: true,
      });

      console.log(checkVerified);
      if (!checkVerified) throw new Error("Email has not been verified!");

      const otp = otpGenerator.generate(6, { digits: true });

      const arrOtp = {
        otp: otp,
        email: email,
      };

      const newOtp = await OtpModel.create(arrOtp);

      if (!newOtp) throw new Error("Error create Otp.");

      const mailOptions = {
        from: "info@test.com", // Địa chỉ email gửi
        to: email, // Email người nhận (người dùng)
        subject: "Your OTP Code", // Tiêu đề email
        text: `Your OTP code is: ${otp}`, // Nội dung email
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          throw new Error("Error sending email");
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).send({
            message: "Otp is sent",
            data: info.response,
            success: true,
          });
        }
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      let { otp, password, confirm } = req.body;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      const totalMins = 5 * 60 * 1000;
      const dateNow = new Date();

      if (!otp) throw new Error("Otp is required!");
      else {
        otp = otp.trim();
      }

      if (!password) throw new Error("Password is required!");
      // else {
      //   password = password.trim();
      // }

      if (!confirm) throw new Error("Confirm is required!");
      else {
        confirm = confirm.trim();
      }

      if (!passwordRegex.test(password))
        throw new Error(
          "Password is invalid. It must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and be at least 8 characters long."
        );

      if (password != confirm)
        throw new Error("Confirm and password is not match!");

      const checkOtp = await OtpModel.findOne({ otp: otp });

      if (!checkOtp) throw new Error("Otp is incorrect!");

      const couterMins = dateNow - checkOtp.createdAt;

      if (couterMins > totalMins) throw new Error("Otp has expired!");

      const hashPassword = bcrypt.hashSync(password, saltRounds);

      const newPassword = await UsersModel.findOneAndUpdate(
        { email: checkOtp.email },
        { password: hashPassword },
        { new: true }
      );

      const deleteOtp = await OtpModel.findOneAndDelete({ otp: otp });

      const mailOptions = {
        from: "info@test.com", // Địa chỉ email gửi
        to: checkOtp.email, // Email người nhận (người dùng)
        subject: "Your OTP Code", // Tiêu đề email
        text: `Your password has changed. New password: ${password}`, // Nội dung email
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          throw new Error("Error sending email");
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      if (newPassword && deleteOtp) {
        return res.status(200).send({
          data: null,
          message: "Reset password successful!",
          success: true,
        });
      }
    } catch (error) {
      return res.status(400).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
  getUserByToken: async (req, res, next) => {
    const token = req.body.token;
    console.log(req.body);
    jwt.verify(token, secretKey, async (err, user) => {
      try {
        const findUser = await UsersModel.findOne({
          email: user.email,
        });
        console.log(findUser);
        res.status(200).json({
          data: findUser,
          message: "success",
        });
      } catch (e) {
        res.status(401).send({
          message: err,
        });
      }
      if (err) {
        console.log(err);
      }
    });
  },
  isLogin: async (req, res, next) => {
    const userEmail = req.query.user;
    if (userEmail) {
      const user = await UsersModel.findOne({ email: userEmail });
      console.log(user.role);
      next();
    } else {
      res.status(400).send({
        message: "Unauthorized",
      });
    }
  },
  isAdmin: async (req, res, next) => {
    const userEmail = req.query.user;
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1];
      console.log(token);
    jwt.verify(token, secretKey, async (err, user) => {
      try {
        if (user.role === "admin") {
          next();
        } else {
          res.status(400).send("UnAuthorized");
        }
      } catch (e) {
        res.status(401).send({
          message: err,
        });
      }
      if (err) {
        console.log(err);
      }
    });
    if (userEmail) {
      const role = await UsersModel.findOne({ email: userEmail }).role;
      if (role === "Admin") {
        next();
      }
    } else {
      res.status(400).send({
        message: "Unauthorized",
      });
    }
  },
};
export default authenticationController;
