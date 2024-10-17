import mongoose from "mongoose";

const mongoURI = "mongodb+srv://dinhhoa0701:H1CiB0BdVrIbB03c@exclusive.izqci.mongodb.net/Exclusive?retryWrites=true&w=majority&appName=Exclusive";

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
