import express from "express";
import Serverless from "serverless-http";
import dotenv from "dotenv";
import connectToMongo from "./src/database/connection.mjs";
import ProductRouter from "./src/routers/productRouter.mjs";
dotenv.config();
// phương thức connect với tham số connect string
const app = express();

const App = () => {
  connectToMongo()
  ProductRouter(app);
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
