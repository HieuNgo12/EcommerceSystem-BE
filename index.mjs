import express from "express";
import Serverless from "serverless-http";
import dotenv from "dotenv";
import connectToMongo from "./src/database/connection.mjs";
import ProductRouter from "./src/routers/productRouter.mjs";
import OrderRouter from "./src/routers/orderRouter.mjs";
import cors from "cors";
import AuthRouter from "./src/routers/authRouter.mjs";
import UserRouter from "./src/routers/userRouter.mjs";
import AdminRouter from "./src/routers/adminRouter.mjs";
import authenticationController from "./src/controllers/authenticationController.mjs";
import morgan from "morgan";
import bodyParser from "body-parser";
import ReviewRouter from "./src/routers/reviewRouter.mjs";
import  validate  from "./src/utils/validate.mjs";
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));

// Connect to MongoDB
connectToMongo();

// Define routes
// app.use("/api/v1/products", ProductRouter);
// app.use("/api/v1/product", ReviewRouter);
// app.use("/api/v1/orders", OrderRouter);
// app.use("/api/v1/auth", AuthRouter);
// app.use(
//   "/api/v1/user",
//   authenticationController.authMiddleware,
//   authenticationController.isUser,
//   UserRouter
// );
// app.use(
//   "/api/v1/admin",
//   authenticationController.authMiddleware,
//   authenticationController.isAdmin,
//   AdminRouter
// );
app.use(cookieParser()); 
const App = () => {
  app.use(morgan("dev"));
  // app.use("/public", express.static(path.join(__dirname, "public")));
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
  connectToMongo();
  // ProductRouter(app);
  // OrderRouter(app);
  // UserRouter(app);

  app.use("/api/v1/auth", AuthRouter);
  app.use("/api/v1/users", validate.authentication, validate.auhthorizationUser, UserRouter);
  app.use("/api/v1/admin", validate.authentication, validate.auhthorizationAdmin, AdminRouter)
  app.use("/api/v1/products", ProductRouter)

// Start server locally if in development mode
if (process.env.NODE_ENV === "dev") {
  app.listen(8080, () => {
    console.log(
      "Server is running on port 8080. Check the app on http://localhost:8080"
    );
  });
}}
App();
export const handler = Serverless(app);

// App();
// Export handler for serverless deployment

// import express from "express";
// import Serverless from "serverless-http";
// import dotenv from "dotenv";
// import connectToMongo from "./src/database/connection.mjs";
// import ProductRouter from "./src/routers/productRouter.mjs";
// import OrderRouter from "./src/routers/orderRouter.mjs";
// import cors from "cors"; // Import CORS
// import AuthRouter from "./src/routers/authRouter.mjs";
// import UserRouter from "./src/routers/userRouter.mjs";
// import AdminRouter from "./src/routers/adminRouter.mjs";
// import authenticationController from "./src/controllers/authenticationController.mjs";
// import morgan from "morgan";
// import bodyParser from "body-parser";

// dotenv.config();
// // phương thức connect với tham số connect string
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(cookieParser()); 

// const App = () => {
//   app.use(morgan("dev"));
//   // app.use("/public", express.static(path.join(__dirname, "public")));
//   app.use(cors());
//   app.use(express.json());
//   app.use(bodyParser.json({ limit: "10mb" }));
//   app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
//   connectToMongo();

//   ProductRouter(app);
//   OrderRouter(app);
//   UserRouter(app);

//   app.use("/api/v1/auth", AuthRouter);
//   app.use("/api/v1/user", authenticationController.authMiddleware, authenticationController.isUser, UserRouter);
//   app.use("/ap1/v1/admin", authenticationController.authMiddleware, authenticationController.isAdmin, AdminRouter)

//   if (process.env.NODE_ENV === "dev") {
//     app.listen(8080, () => {
//       console.log(
//         "Server is running on port 8080. Check the app on http://localhost:8080"
//       );
//     });
//   }
// };
// App();
// // You don't need to listen to the port when using serverless functions in production

// export const handler = Serverless(app);
