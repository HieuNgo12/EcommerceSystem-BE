import UsersModel from "../database/models/users.mjs";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import otpGenerator from "otp-generator";
import OtpModel from "../database/models/otp.mjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
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

const authenticationController = {
  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required!",
        });
      } else {
        email = email.trim();
      }
      if (!password) {
        return res.status(400).json({
          message: "password is required!",
        });
      }

      const checkEmail = await UsersModel.findOne({
        email: email,
      });

      if (!checkEmail) {
        return res.status(400).json({
          message: "Email is incorrect",
        });
      }

      if (checkEmail.status === "suspended") {
        const currentDate = new Date();
        const MAX_TIME = 1 * 60 * 1000;
        const countTime = currentDate - checkEmail.timeSuspended;
        if (countTime < MAX_TIME) {
          return res.status(400).json({
            message: "Your account is suspended for 5 mins",
          });
        } else {
          checkEmail.failedLoginAttempts = 0;
          checkEmail.timeSuspended = null;
          checkEmail.status = "active";
          await checkEmail.save();
        }
      }

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

            checkEmail.failedLoginAttempts = 0;
            await checkEmail.save();

            return res.status(200).json({
              accessToken: accessToken,
              refreshToken: refreshToken,
              message: "Login successful!",
              success: true,
            });
          } else {
            checkEmail.failedLoginAttempts += 1;
            await checkEmail.save();

            if (checkEmail.failedLoginAttempts > 5) {
              checkEmail.status = "suspended";
              checkEmail.timeSuspended = new Date();
              await checkEmail.save();
              res.status(400).json({
                message: "Your account is suspended for 5 mins",
                data: null,
                success: false,
              });
            } else {
              res.status(400).json({
                message: "Password is incorrect",
                data: null,
                success: false,
              });
            }
          }
        });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  loginByGG: async (req, res, next) => {
    try {
      const token =
        req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1];
      const decoded = jwtDecode(token);

      const checkEmail = await UsersModel.findOne({ email: decoded.email });

      if (!checkEmail) {
        return res.status(400).json({
          message: "Email is incorrect",
        });
      }

      if (checkEmail.status === "suspended") {
        return res.status(400).json({
          message: "Your account is suspended by Admin",
        });
      }

      const userData = {
        id: checkEmail.id,
        username: checkEmail.username,
        email: checkEmail.email,
        isEmailVerified: checkEmail.isEmailVerified,
        role: checkEmail.role,
      };

      if (userData) {
        const accessToken = jwt.sign(userData, secretKey, {
          expiresIn: "1m",
        });

        const refreshToken = jwt.sign(userData, secretKey, {
          expiresIn: "365d",
        });

        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: refreshToken,
          message: "Login successful!",
          success: true,
        });
      } else {
        res.status(400).send({
          message: "Email is not found!",
          data: null,
          success: false,
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const token =
        req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1];
      const decoded = jwtDecode(token);
      const dateNow = new Date();

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
      if (!username) {
        return res.status(400).json({
          message: "Username is required!",
          success: false,
        });
      } else {
        username = username.trim();
      }
      const checkUserNameHasAdminWord = email.includes("admin");
      if (checkUserNameHasAdminWord) {
        return res.status(400).json({
          message: "Username does not include admin",
          success: false,
        });
      }

      const checkUserName = await UsersModel.findOne({ username });
      if (checkUserName) {
        return res.status(400).json({
          message: "Username already exists",
          success: false,
        });
      }

      if (!email) {
        return res.status(400).json({
          message: "Email is required!",
          success: false,
        });
      } else {
        email = email.trim();
      }
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          message: "Invalid email",
          success: false,
        });
      }

      const checkEmailHasAdminWord = email.includes("admin");
      if (checkEmailHasAdminWord) {
        return res.status(400).json({
          message: "Email does not include admin",
          success: false,
        });
      }

      const checkEmail = await UsersModel.findOne({ email });

      if (checkEmail) {
        return res.status(400).json({
          message: "Email already exists",
          success: false,
        });
      }

      if (!password) {
        return res.status(400).json({
          message: "Password is required!",
          success: false,
        });
      }

      // Kiểm tra password có đúng định dạng không (ít nhất 1 chữ hoa, 1 chữ thường, 1 số, và ít nhất 8 ký tự)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password is invalid. It must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and be at least 8 characters long.",
          success: false,
        });
      }

      if (!confirm) {
        return res.status(400).json({
          message: "Confirm is required!",
          success: false,
        });
      } else {
        confirm = confirm.trim();
      }
      if (confirm == password) {
        bcrypt.hash(password, saltRounds, async (err, hashPassword) => {
          if (err) {
            return res.status(500).json({
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

          return res.status(201).json({
            data: createdUser,
            message: "Register successful!",
            success: true,
          });
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  registerByGG: async (req, res, next) => {
    try {
      const token =
        req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1];
      const decoded = jwtDecode(token);
      const getUserName = decoded.email.split("@")[0];

      const generateRandomPassword = () => {
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const digits = "0123456789";
        const allChars = uppercaseChars + lowercaseChars + digits;

        // Đảm bảo có ít nhất một ký tự của từng loại
        const randomUppercase =
          uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        const randomLowercase =
          lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        const randomDigit = digits[Math.floor(Math.random() * digits.length)];

        // Đảm bảo độ dài tối thiểu là 8 ký tự
        let password = randomUppercase + randomLowercase + randomDigit;

        // Thêm các ký tự ngẫu nhiên cho đủ độ dài yêu cầu
        for (let i = password.length; i < 8; i++) {
          password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Chuyển đổi chuỗi thành mảng và trộn ngẫu nhiên các ký tự
        password = password
          .split("")
          .sort(() => 0.5 - Math.random())
          .join("");

        return password;
      };

      const checkEmail = await UsersModel.findOne({ email: decoded.email });
      if (checkEmail) {
        return res.status(400).send({
          message: "Email has been used",
          data: null,
          success: false,
        });
      }

      const password = generateRandomPassword();

      bcrypt.hash(password, saltRounds, async (err, hashPassword) => {
        if (err) {
          return res.status(500).send({
            message: "Error hashing password",
            data: null,
            success: false,
          });
        }

        const createdUser = await UsersModel.create({
          email: decoded.email,
          username: getUserName,
          password: hashPassword,
          isEmailVerified: true,
          firstName: decoded.given_name,
          lastName: decoded.family_name,
          avatar: decoded.picture,
        });

        if (createdUser) {
          const mailOptions = {
            from: "info@test.com", // Địa chỉ email gửi
            to: decoded.email, // Email người nhận (người dùng)
            subject: "Your OTP Code", // Tiêu đề email
            text: `Your Password is: ${password}`, // Nội dung email
          };

          await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              throw new Error("Error sending email");
            } else {
              console.log("Email sent: " + info.response);
              return res.status(201).send({
                data: createdUser,
                message: "Register successful!",
                success: true,
              });
            }
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
