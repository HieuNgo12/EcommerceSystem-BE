import authenticationController from "../controllers/authenticationController.mjs";
import userController from "../controllers/userController.mjs";
import express from "express";

const UserRouter = (app) => {
  app.get("/api/v1/user", userController.getUser);
  app.post("/api/v1/user", userController.createUser);
  app.put("/api/v1/user/:userId", userController.updateUser);
  app.delete("/api/v1/user/:userId", userController.deleteUser);
};
export default UserRouter;
