import mongoose from "mongoose";
// khởi tạo schema (định nghĩa các field cho các document và kiểu dữ liệu của field đó)
const userSchema = new mongoose.Schema(
  {
    email: { type: String, require: true },
    userName: { type: String, require: true },
    password: { type: String, require: true },
    // firstName: { type: String, require: true },
    // lastName: { type: String, require: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: false }, //update gender option
    // gender: { type: Boolean, required: true },
    // dateOfBirth: { type: Date , require : true},
    // address: { type: String, require: true },
    phone: { type: Number, require: true },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    // avatar: { type: String },
    rank: { type: String },
    loyaltyPoints: { type: Number, default: 0 },
    // cardNumber: { type: Number },
    totalSpent: { type: Number, default: 0 }, 
    status: { type: String, enum: ["pending","active", "inactive", "suspended"], default: "pending" },
    role: { type: String, default: "user" },
    // purchaseHistory: [
    //   {
    //     itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" }, 
    //     amount: Number, 
    //     date: { type: Date, default: Date.now },
    //   }
    // ],    
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
