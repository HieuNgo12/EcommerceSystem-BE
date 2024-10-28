import express from "express";
import Serverless from "serverless-http";
import dotenv from "dotenv";
import connectToMongo from "./src/database/connection.mjs";
import ProductRouter from "./src/routers/productRouter.mjs";
import OrderRouter from "./src/routers/orderRouter.mjs";
import cors from "cors"; // Import CORS
import AuthRouter from "./src/routers/authRouter.mjs";
import UserRouter from "./src/routers/userRouter.mjs";
import AdminRouter from "./src/routers/adminRouter.mjs";
import PromotionRouter from "./src/routers/promotionRouter.mjs";
import UploadFile from "./src/utils/UploadFile.mjs";
import authenticationController from "./src/controllers/authenticationController.mjs";
import morgan from "morgan";
import bodyParser from "body-parser";
import validate from "./src/utils/validate.mjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
// phương thức connect với tham số connect string
const app = express();
// app.use(cors());

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(express.json());
app.use(cookieParser());
const App = () => {
  app.use(morgan("dev"));
  // app.use("/public", express.static(path.join(__dirname, "public")));

  app.use(express.json());
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
  connectToMongo();
  OrderRouter(app);

  app.use("/api/v1/auth", AuthRouter);

  app.use(
    "/api/v1/users",
    validate.authentication,
    validate.auhthorizationUser,
    UserRouter
  );

  app.use(
    "/api/v1/admin",
    validate.authentication,
    validate.auhthorizationAdmin,
    AdminRouter
  );

  app.use(
    "/api/v1/promotion",
    validate.authentication,
    validate.auhthorizationAdmin,
    PromotionRouter
  );

  app.use("/api/v1/products", ProductRouter);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (process.env.NODE_ENV === "dev") {
    app.listen(8080, () => {
      console.log(
        "Server is running on port 8080. Check the app on http://localhost:8080"
      );
    });
  }
};
App();
// You don't need to listen to the port when using serverless functions in production

export const handler = Serverless(app);
