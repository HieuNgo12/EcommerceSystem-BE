import UsersModel from "../database/models/users.mjs";

const userController = {
  getUser: async (req, res, next) => {
    try {
      const { userName, email } = req.body;
      if (!userName) throw new Error("userName is required!");
      if (!email) throw new Error("email is required!");

      const newUser = await UsersModel.find({
        userName,
        email,
      });
      res.status(201).send({
        data: newUser,
        message: "User found successfully!",
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
  createUser: async (req, res, next) => {
    try {
      const { userName, email } = req.body;
      if (!userName)
        return res.status(401).send({ message: "userName is required!" });
      if (!email)
        return res.status(401).send({ message: "email is required!" });

      const createdUser = await UsersModel.create({
        userName,
        email,
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
  deleteUser: (req, res, next) => {
    UsersModel.deleteOne({
      _id: req.params.userId,
    });

    if (userRole === "admin") {
      next(); // Cho phép truy cập vào route
    } else {
      res.status(403).send("Forbidden"); // Trả về lỗi 403 nếu không có quyền truy cập
    }
  },
};
export default userController;
