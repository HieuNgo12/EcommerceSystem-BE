import mongoose from "mongoose";
// khởi tạo schema (định nghĩa các field cho các document và kiểu dữ liệu của field đó)
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: false },
    username: { type: String, required: false },
    password: { type: String, required: false },
    firstName: { type: String, required: false, default: "" },
    lastName: { type: String, required: false, default: "" },
    gender: { type: Boolean, required: false, default: true },
    dateOfBirth: { type: Date, required: false, default: Date.now },
    address: {
      number: { type: String, required: false, default: "" },
      ward: { type: String, required: false, default: "" },
      district: { type: String, required: false, default: "" },
      city: { type: String, required: false, default: "" },
    },
    phone: { type: Number, required: false, default: null },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    zipcode: { type: Number, default: null },
    avatar: { type: String, default: "https://rgb.vn/wp-content/uploads/2024/05/RGB-DOGECOIN-KABOSU-MEMECOIN-3-1024x614.webp" },
    rank: {
      type: String,
      enum: ["diamond", "gold", "silver", "normal"],
      default: "normal",
    },
    loyaltyPoints: { type: Number, default: 0 },
    cardNumber: { type: Number, default: null },
    totalSpent: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "active", "inactive", "suspended"],
      default: "pending",
    },
    role: { type: String, default: "user" },
    purchaseHistory: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        amount: Number,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// const products = [
//     { firstName: 'User 1', lastName: 'LA', email: "abc@gmail.com", address: "127 blk", role: "admin" },
//     { firstName: 'User 2', lastName: 'LA', email: "abc@gmail.com", address: "127 blk", role: "member" },
//   ];
// const userSchema = new mongoose.Schema({
//   firstName: { type: String },
//   lastName: { type: String },
//   username: {type: String, unique: true },
//   email: { type: String, unique: true  },
//   address: { type: String },
//   roles: { type: String , enum: ["Admin", "User"]},
// });

// định nghĩa model cần truyền với phương thức model và các tham số lần lượt: tên collections, schema của document
const UsersModel = mongoose.model("user", userSchema);
// UsersModel.insertMany(products);
export default UsersModel;
