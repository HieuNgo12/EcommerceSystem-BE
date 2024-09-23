import mongoose from 'mongoose';
// khởi tạo schema (định nghĩa các field cho các document và kiểu dữ liệu của field đó)
const productSchema = new mongoose.Schema({
    title: String,
    categories: String,
});
// định nghĩa model cần truyền với phương thức model và các tham số lần lượt: tên collections, schema của document
const ProductModel = mongoose.model('users', productSchema);
export default ProductModel;