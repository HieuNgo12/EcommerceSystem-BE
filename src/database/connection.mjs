import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI =
  `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@exclusive.izqci.mongodb.net/?retryWrites=true&w=majority&appName=Exclusive/test`
const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Mongo connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

export default connectToMongo;
