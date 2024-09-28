import CartModel from "../database/models/cart.mjs";

const cartController = {
  getCart: async (req, res, next) => {
    const product = await CartModel.find({
      userName,
      email,
    });
    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },
  createCart: async (req, res, next) => {

    const { title, categories, image, description, price, rating } = req.body;
    const product = await CartModel.create({
      title,
      categories,
      image,
      description,
      price,
      rating,
    });
    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },
  updateProduct: async (req, res, next) => {

    const { title, categories, image, description, price, rating } = req.body;
    const product = await ProductModel.create({
      title,
      categories,
      image,
      description,
      price,
      rating,
    });
    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },
  deleteProduct: (req, res, next) => {},
};
export default cartController;
