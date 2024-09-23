import mongoose from "mongoose";

const mongoURI =
  "mongodb+srv://ngothehieu12:a7Q3MRP9npuRwrqq@exclusive.izqci.mongodb.net/?retryWrites=true&w=majority&appName=Exclusive";

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI);
    console.log("Mongo connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

export default connectToMongo;
