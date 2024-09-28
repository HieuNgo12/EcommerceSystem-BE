import ProductModel from "../database/models/product.mjs";

const productController = {
  getProduct: async (req, res, next) => {
    const product = await ProductModel.find({});
    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },
  getProductById: async (req, res, next) => {
    const product = await ProductModel.find({});
    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },
  postProduct: async (req, res, next) => {
    const { title, categories, image, description, price, rating } = req.body;

    const product = await ProductModel.create(req.body);
    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },
  updateProduct: async (req, res, next) => {
    const { title, categories, image, description, price, rating } = req.body;

    const product = await ProductModel.update(req.body);
    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },
  deleteProduct: async (req, res, next) => {},
};

export default productController;
