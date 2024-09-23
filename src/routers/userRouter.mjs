import userController from "../controllers/userController.mjs";

const UserRouter =(app) => {
    
    app.get("/user", userController.getUser);
    app.post("/user", userController.createUser);
    app.put("/user/:userId", userController.updateUser);
    app.delete("/user/:userId", userController.deleteUser);
  
};
export default UserRouter;
