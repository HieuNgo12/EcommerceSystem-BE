import UsersModel from "../database/models/users.mjs";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

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

  updateUser: async (req, res, next) => {
    try {
      const userId = req.params.userId;
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
};
export default AdminController;
