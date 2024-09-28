import mongoose from 'mongoose';
// khởi tạo schema (định nghĩa các field cho các document và kiểu dữ liệu của field đó)
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, required: true}
});
const products = [
    { firstName: 'User 1', lastName: 'LA', email: "abc@gmail.com", address: "127 blk", role: "admin" },
    { firstName: 'User 2', lastName: 'LA', email: "abc@gmail.com", address: "127 blk", role: "member" },
  ];  

// định nghĩa model cần truyền với phương thức model và các tham số lần lượt: tên collections, schema của document
const UsersModel = mongoose.model('user', userSchema);
UsersModel.insertMany(products);
export default UsersModel;