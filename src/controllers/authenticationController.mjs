import UsersModel from "../database/models/users.mjs";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import otpGenerator from "otp-generator";
import OtpModel from "../database/models/otp.mjs";
import jwt from "jsonwebtoken";
import UsersModel from "../database/models/users.mjs";

const SECRET_KEY = "your_secret_key";
const secretKey = process.env.SECRET_KEY || "mysecretkey";
const saltRounds = 10;

const authenticationController = {
  login: async (req, res, next) => {
    const { email, password } = req.body;
    // tìm thông tin user | tài khoản với email được gửi lên
    const currentUser = await UsersModel.findOne({ email });
    if (!currentUser) throw new Error("Sai tài khoản hoặc mật khẩu");

    const hashingPasswordLogin = bcrypt.hashSync(password, currentUser.salt);
    // compare password
    if (hashingPasswordLogin !== currentUser.password)
      throw new Error("Sai tài khoản hoặc mật khẩu");

    res.status(201).send({
      message: "Login successfully!",
      email,
      // v.v user info
    });
  },
  register: async (req, res, next) => {
    const { email, password } = req.body;
    // tìm thông tin user | tài khoản với email được gửi lên
    const currentUser = await UsersModel.findOne({ email });
    if (!currentUser) throw new Error("Sai tài khoản hoặc mật khẩu");

    const hashingPasswordLogin = bcrypt.hashSync(password, currentUser.salt);
    // compare password
    if (hashingPasswordLogin !== currentUser.password)
      throw new Error("Sai tài khoản hoặc mật khẩu");

    res.status(201).send({
      message: "Login successfully!",
      email,
      // v.v user info
    });
  },
  isLogin: async (req, res, next) => 
    {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(401).send({ err: "Token is expired" });
      }
      try {
        jwt.verify(token, process.env.SECRET_TOKEN);
        next();
      } catch (err) {
        res.status(400).send({ err: "Invalid Token" });
      }
    }
  ,
  isAdmin: async (req, res, next) => {
    const authorization = req.headers["authorization"]?.split(" ");

    if (Array.isArray(authorization)) {
      const token = authorization[1];

      if (token) {
        const [from, userId, email, ...otherInfo] = token.split("-");

        if (token == "admin") {
          next();
        }

        req.user = {
          from,
          userId,
          email,
          otherInfo,
        };

        return next();
      } else {
        res.status(403).send("Unauthorized");
      }
      if (!password) throw new Error("password is required!");
      else {
        password = password.trim();
      }

      const checkEmail = await UsersModel.findOne({
        email: email,
      });

      if (!checkEmail) {
        res.status(403).send({
          message: "email is incorrect",
          data: null,
          success: false,
        });
      } else {
        bcrypt.compare(password, checkEmail.password).then(function (result) {
          // result == true
          if (result && checkEmail) {
            const userData = {
              id: checkEmail.id,
              email: checkEmail.email,
              role: checkEmail.role,
            };

            const token = jwt.sign(userData, secretKey, { expiresIn: "1h" });

            return res.status(200).send({
              data: token,
              message: "Login successful!",
              success: true,
            });
          } else {
            res.status(403).send({
              message: "Password is incorrect",
              data: null,
              success: false,
            });
          }
        });
      }
    } catch (error) {
      res.status(403).send("Unauthorized");
    }
  },

  register: async (req, res, next) => {
    try {
      let { userName, email, password, gender, phone } = req.body;

      if (!userName) throw new Error("userName is required!");
      else {
        userName = userName.trim();
      }
      if (!email) throw new Error("email is required!");
      else {
        email = email.trim();
      }
      if (!password) throw new Error("password is required!");
      else {
        password = password.trim();
      }
      // if (!address) throw new Error("address is required!");
      // else {
      //   address = address.trim();
      // }
      // if (!age) throw new Error("age is required!");

      const checkUserName = await UsersModel.findOne({ userName });
      const checkEmail = await UsersModel.findOne({ email });

      if (checkUserName) {
        return res.status(403).send({
          message: "Username already exists",
          data: null,
          success: false,
        });
      }

      if (checkEmail) {
        return res.status(403).send({
          message: "Email already exists",
          data: null,
          success: false,
        });
      }

      // Kiểm tra password có đúng định dạng không (ít nhất 1 chữ hoa, 1 chữ thường, 1 số, và ít nhất 8 ký tự)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(403).send({
          message:
            "Password is invalid. It must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and be at least 8 characters long.",
          data: null,
          success: false,
        });
      } else {
        if (!checkUserName && !checkEmail) {
          bcrypt.hash(password, saltRounds, async (err, hashPassword) => {
            if (err) {
              return res.status(500).send({
                message: "Error hashing password",
                data: null,
                success: false,
              });
            }

            const createdUser = await UsersModel.create({
              userName,
              email,
              password: hashPassword,
              phone,
              gender, 
            });

            return res.status(200).send({
              data: createdUser,
              message: "Register successful!",
              success: true,
            });
          });
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

  forgotPassword: async (req, res, next) => {
    try {
      let { email } = req.body;
      if (!email) throw new Error("email is required!");
      else {
        email = email.trim();
      }

      const otp = otpGenerator.generate(6, { digits: true });

      const arrOtp = {
        otp: otp,
        email: email,
      };
      const newOtp = await OtpModel.create(arrOtp);

      if (newOtp) {
        return res.status(200).send({
          message: "create otp is successful",
          data: newOtp,
          success: true,
        });
      } else {
        return res.status(403).send({
          message: error.message,
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

  resetPassword: async (req, res) => {
    try {
      let { otp, password } = req.body;

      const totalMins = 5 * 60 * 1000;
      const dateNow = new Date();

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!password) throw new Error("password is required!");
      else {
        password = password.trim();
      }

      if (!otp) throw new Error("otp is required!");
      else {
        otp = otp.trim();
      }
      const checkOtp = await OtpModel.findOne({ otp: otp });

      const couterMins = dateNow - checkOtp.createdAt;

      if (!checkOtp) {
        return res.status(400).send({
          massage: "otp không đúng",
          data: null,
          success: false,
        });
      } else {
        if (couterMins > totalMins) {
          return res.status(400).send({
            massage: "otp đã hết hạn",
            data: null,
            success: false,
          });
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

            const newPassword = await UsersModel.findOneAndUpdate(
              { email: checkOtp.email },
              { password: hashPassword },
              { new: true }
            );

            await OtpModel.findOneAndDelete({ otp: otp });

            if (newPassword) {
              return res.status(200).send({
                data: newPassword,
                message: "reset password successful!",
                success: true,
              });
            } else {
              return res.status(403).send("reset password failed");
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

  authMiddleware: async (req, res, next) => {
    try {
      const authorization = req.headers["authorization"]?.split(" ");

      if (Array.isArray(authorization)) {
        const token = authorization[1];

        if (token) {
          jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
              console.error("JWT verification failed:", err.message);
            } else {
              req.user = decoded;
              console.log(decoded);
              next();
            }
          });
        } else {
          res.status(403).send("Unauthorized");
        }
      } else {
        res.status(403).send("Unauthorized");
      }
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).send("Invalid or expired token");
    }
  },

  isUser: async (req, res, next) => {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied. Users only." });
    }
    next();
  },

  isAdmin: async (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  },
};
export default authenticationController;
