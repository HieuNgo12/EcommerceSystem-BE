import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Updated connection string format
const mongoURI = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@exclusive.izqci.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Exclusive%2Ftest`;

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo connected");

    

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToMongo;