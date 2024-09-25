import ProductModel from "../database/models/product.mjs";

const productController = {
  getProduct: async (req, res, next) => {
    const product = await ProductModel.find({
      userName,
      email,
    });
    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },
  postProduct: async (req, res, next) => {
    const product = await ProductModel.create({
        title: "abc",
        categories: "abc"
      });
      res.status(201).send({
        data: product,
        message: "User found successfully!",
        success: true,
      });

  },
  updateProduct: (req, res, next) => {},
  deleteProduct: (req, res, next) => {},
};
export default productController;
