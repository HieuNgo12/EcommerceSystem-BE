import mongoose from "mongoose";
// khởi tạo schema (định nghĩa các field cho các document và kiểu dữ liệu của field đó)
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    gender: { type: Boolean, default: true },
    dateOfBirth: { type: Date, default: Date.now },
    address: {
      number: { type: String, default: "" },
      ward: { type: String, default: "" },
      district: { type: String, default: "" },
      city: { type: String, default: "" },
    },
    phone: { type: String, default: null },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isIdCardVerified: { type: Boolean, default: false },
    zipcode: { type: String, default: null },
    avatar: { type: String, default: "https://rgb.vn/wp-content/uploads/2024/05/RGB-DOGECOIN-KABOSU-MEMECOIN-3-1024x614.webp" },
    rank: {
      type: String,
      enum: ["diamond", "gold", "silver", "normal"],
      default: "normal",
    },
    loyaltyPoints: { type: Number, default: 0 },
    cardNumber: { type: Number, default: null },
    idCard: { type: Number, default: null },
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

// định nghĩa model cần truyền với phương thức model và các tham số lần lượt: tên collections, schema của document
const UsersModel = mongoose.model("user", userSchema);
// UsersModel.insertMany(products);
export default UsersModel;
