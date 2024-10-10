import express from "express";
import userController from "../controllers/userController.mjs";
import AdminController from "../controllers/adminController.mjs";
import authenticationController from "../controllers/authenticationController.mjs";

const router = express.Router();

router.post("/logout", authenticationController.logout);

router.get("/users", AdminController.getUsers);

router.put("/user-update/:userId", AdminController.updateAllUser);

router.patch("/user-update/:userId", AdminController.updateUser);

router.delete("/user-delete/:userId", AdminController.deleteUser);

export default router;
