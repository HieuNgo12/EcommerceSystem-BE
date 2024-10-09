import ProductModel from "../database/models/product.mjs";

const productController = {
  getProduct: async (req, res, next) => {
    console.log("abc");
    const product = await ProductModel.find({})
      .populate("reviewId")
      .then((data) => 
      res.status(201).send({
        data: data,
        message: "User found successfully!",
        success: true,
      }))
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
    const product = await ProductModel.create(req.body);
    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },
  createProductData: async (req, res, next) => {
    // console.log(req.body);
 
    const product = await ProductModel.insertMany(req.body);

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
  deleteAllProducts: async (req, res, next) => {
    const product = await ProductModel.deleteMany({});
    res.status(201).send({
      data: product,
      message: "Delete All Products successfully!",
      success: true,
    });
  },
};

export default productController;
