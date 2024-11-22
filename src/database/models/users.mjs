import mongoose from "mongoose";
// khởi tạo schema (định nghĩa các field cho các document và kiểu dữ liệu của field đó)
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    failedLoginAttempts: { type: Number, default: 0 },
    timeSuspended: { type: Date, default: null },
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
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dsxlqhn53/image/upload/v1729910693/users/default.jpg",
    },
    rank: {
      type: String,
      enum: ["diamond", "gold", "silver", "normal"],
      default: "normal",
    },
    cardNumber: { type: String, default: "" },
    idCard: { type: String, default: "" },
    loyaltyPoints: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "active", "inactive", "suspended"],
      default: "pending",
    },
    role: { type: String, enum: ["user", "admin", "super"], default: "user" },
    reviewId: { type: String, ref: "reviews" },
    supportId: { type : String , ref : "supports"},
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

const UsersModel = mongoose.model("user", userSchema);

export default UsersModel;
