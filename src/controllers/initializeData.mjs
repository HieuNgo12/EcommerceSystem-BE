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
    createdAt: "2024-08-13T15:12:18.247Z",
    category: "electronics",
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 17 Laptop",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    price: "150",
    rating: {
      rate: 3.9,
      count: 120,
    },
    status: "Active",
    id: "1",
    startDate: "2024-08-25",
    startTime: "16:06",
    endDate: "2024-08-25",
    endTime: "16:07",
  },
  {
    createdAt: "2024-08-13T12:29:53.634Z",
    category: "men's clothing",
    title: "Mens Casual Premium Slim Fit T-Shirts",
    image:
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
    price: "22.3",
    rating: {
      rate: 4.1,
      count: 259,
    },
    status: "status 2",
    id: "2",
  },
  {
    createdAt: "2024-08-13T21:46:48.490Z",
    category: "men's clothing",
    title: "Mens Cotton Jacket",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    description:
      "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day",
    price: "55.99",
    rating: {
      rate: 4.7,
      count: 500,
    },
    status: "status 3",
    id: "3",
  },
  {
    createdAt: "2024-08-13T17:46:09.490Z",
    category: "men's clothing",
    title: "Mens Casual Slim Fit",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    description:
      "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
    price: "15.99",
    rating: {
      rate: 2.1,
      count: 430,
    },
    status: "status 4",
    id: "4",
  },
  {
    createdAt: "2024-08-13T11:28:21.020Z",
    category: "jewelery",
    title:
      "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    description:
      "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
    price: "695",
    rating: {
      rate: 4.6,
      count: 400,
    },
    status: "status 5",
    id: "5",
  },
];

const initializeData = () => {
  ProductModel.insertMany(products);
};
export default initializeData;
