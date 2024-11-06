import UsersModel from "../database/models/users.mjs";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import validator from "validator";

const secretKey = process.env.SECRET_KEY || "mysecretkey";
const saltRounds = 10;

const AdminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await UsersModel.find({ role: "user" });
      res.status(200).json({
        message: "Get user successfully",
        data: users,
        success: true,
      });
    } catch (error) {
      return res.status(401).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  registerByAdmin: async (req, res, next) => {
    try {
      const file = req.file;
      let { username, email, password, confirm } = req.body;
      if (!username) {
        return res.status(400).send({
          message: "Username is required!",
          data: null,
          success: false,
        });
      } else {
        username = username.trim();
      }
      const checkUserNameHasAdminWord = email.includes("admin");
      if (checkUserNameHasAdminWord) {
        return res.status(400).send({
          message: "Username does not include admim",
          data: null,
          success: false,
        });
      }

      const checkUserName = await UsersModel.findOne({ username });
      if (checkUserName) {
        return res.status(400).send({
          message: "Username already exists",
          data: null,
          success: false,
        });
      }

      if (!email) {
        return res.status(400).send({
          message: "Email is required!",
          data: null,
          success: false,
        });
      } else {
        email = email.trim();
      }
      if (!validator.isEmail(email)) {
        return res.status(400).send({
          message: "Invalid email",
          data: null,
          success: false,
        });
      }

      const checkEmailHasAdminWord = email.includes("admin");
      if (checkEmailHasAdminWord) {
        return res.status(400).send({
          message: "Email does not include admin",
          data: null,
          success: false,
        });
      }

      const checkEmail = await UsersModel.findOne({ email });

      if (checkEmail) {
        return res.status(400).send({
          message: "Email already exists",
          data: null,
          success: false,
        });
      }

      if (!password) {
        return res.status(400).send({
          message: "Password is required!",
          data: null,
          success: false,
        });
      } else {
        password = password.trim();
      }

      // Kiểm tra password có đúng định dạng không (ít nhất 1 chữ hoa, 1 chữ thường, 1 số, và ít nhất 8 ký tự)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).send({
          message:
            "Password is invalid. It must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and be at least 8 characters long.",
          data: null,
          success: false,
        });
      }

      if (!confirm) {
        return res.status(400).send({
          message: "Confirm is required!",
          data: null,
          success: false,
        });
      } else {
        confirm = confirm.trim();
      }

      if (confirm !== password) {
        return res.status(400).send({
          message: "Confirm is not match Password!",
          data: null,
          success: false,
        });
      } else {
        bcrypt.hash(password, saltRounds, async (err, hashPassword) => {
          if (err) {
            return res.status(500).send({
              message: "Error hashing password",
              data: null,
              success: false,
            });
          }

          const createdUser = await UsersModel.create({
            ...req.body,
            password: hashPassword,
          });

          if (!file) {
            return res.status(201).json({
              message: "Create account successful!",
              success: true,
            });
          } else {
            const dataUrl = `data:${
              file.mimetype
            };base64,${file.buffer.toString("base64")}`;
            cloudinary.uploader.upload(
              dataUrl,
              {
                public_id: createdUser._id,
                resource_type: "auto",
                folder: "users",
                overwrite: true,
                // có thể thêm field folder nếu như muốn tổ chức
              },
              async (err, result) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ error: "File upload failed.", details: err });
                }

                if (result) {
                  // req.secure_url = result.secure_url;
                  // req.public_id = result.public_id;

                  const updatedUser = await UsersModel.findByIdAndUpdate(
                    createdUser._id,
                    { avatar: result.secure_url },
                    {
                      new: true,
                    }
                  );

                  if (updatedUser) {
                    return res.status(201).json({
                      message: "Create account successful!",
                      success: true,
                    });
                  } else {
                    throw new Error();
                  }
                }
              }
            );
          }
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

  updateUser: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const secure_url = req.secure_url;
      if (!secure_url) {
        let userData = req.body;
        const updatedUser = await UsersModel.findByIdAndUpdate(
          userId,
          userData,
          {
            new: true,
          }
        );
        res.status(200).json({
          message: "User updated successfully",
          data: updatedUser,
          success: true,
        });
      } else {
        let userData = { ...req.body, avatar: secure_url };
        const updatedUser = await UsersModel.findByIdAndUpdate(
          userId,
          userData,
          {
            new: true,
          }
        );
        res.status(200).json({
          message: "User updated successfully",
          data: updatedUser,
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

  updateAllUser: async (req, res, next) => {
    try {
      const userId = req.params.userId;
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

  deleteUser: async (req, res, next) => {
    try {
      const userId = req.params.userId;

      await cloudinary.uploader.destroy(
        `users/${userId}`,
        {
          resource_type: "image",
          folder: "users",
          // có thể thêm field folder nếu như muốn tổ chức
        },
        (error, result) => {
          if (error) {
            console.error("Error:", error);
          } else {
            console.log("Result:", result);
          }
        }
      );

      const delUser = await UsersModel.findByIdAndDelete(userId);

      if (delUser) {
        res.status(200).json({
          message: "Delete User successfully",
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

  createVoucher: async (req, res, next) => {
    try {
      
    } catch (error) {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
};
export default AdminController;
