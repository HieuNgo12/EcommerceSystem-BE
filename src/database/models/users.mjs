import mongoose from 'mongoose';
// khởi tạo schema (định nghĩa các field cho các document và kiểu dữ liệu của field đó)
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
});
// định nghĩa model cần truyền với phương thức model và các tham số lần lượt: tên collections, schema của document
const UsersModel = mongoose.model('user', userSchema);
export default UsersModel;