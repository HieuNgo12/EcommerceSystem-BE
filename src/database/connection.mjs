import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Updated connection string format
const mongoURI = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@exclusive.izqci.mongodb.net/Exclusive`;

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,       // Sử dụng URL parser mới
      useUnifiedTopology: true,    // Sử dụng engine khám phá server mới
    });
    console.log("Mongo connected");

    

  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);  // Thoát nếu kết nối thất bại
  }
};

export default connectToMongo;