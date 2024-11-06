import ProductModel from "../database/models/product.mjs";

const users = [
  {
    firstName: "User 1",
    lastName: "LA",
    email: "abc@gmail.com",
    address: "127 blk",
    role: "admin",
  },
  {
    firstName: "User 2",
    lastName: "LA",
    email: "abc@gmail.com",
    address: "127 blk",
    role: "member",
  },
];

const products = [
  {
    title: "Car",
    categories: "vehicle",
    image: "./image.png",
    description: "Very Fast Car",
    price: 90,
    rating: 5,
  },
  {
    title: "car",
    categories: "vehicle",
    image: "./image.png",
    description: "Very Fast Car",
    price: 90,
    rating: 5,
  },
];
const initializeData = () => {
  ProductModel.insertMany(products);
};
export default initializeData;
