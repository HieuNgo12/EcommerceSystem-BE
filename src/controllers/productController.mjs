import ProductModel from "../database/models/product.mjs";

const productController = {
  //Add a new product (Admin only).
  postProduct: async (req, res, next) => {
    const product = await ProductModel.create(req.body);
    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },

  //Update product details (Admin only).
  createProductData: async (req, res, next) => {
    // console.log(req.body);

    const product = await ProductModel.insertMany(req.body);

    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },

  //Update an existing product (Admin only).
  updateProduct: async (req, res, next) => {
    const { title, categories, image, description, price, rating } = req.body;

    const product = await ProductModel.update(req.body);
    res.status(201).send({
      data: product,
      message: "User found successfully!",
      success: true,
    });
  },

  //Delete a product (Admin only).
  deleteAllProducts: async (req, res, next) => {
    const product = await ProductModel.deleteMany({});
    res.status(201).send({
      data: product,
      message: "Delete All Products successfully!",
      success: true,
    });
  },

  //Get a list of all products. (both users/admin)
  getAllProducts: async (req, res, next) => {
    console.log("abc");
    const products = await ProductModel.find({})
      .populate("reviewId")
      .then((data) => {
        res.status(201).send({
          data: products,
          message: "All products retrieved successfully!",
          success: true,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "Failed to retrieve products.",
          success: false,
        });
      });
  },

  //Get details of a specific product.
  getProductById: async (req, res, next) => {
    const { productId } = req.params;
    try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).send({
          message: "Product not found!",
          success: false,
        });
      }
      res.status(200).send({
        data: product,
        message: "Product retrieved successfully!",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: "Failed to retrieve product.",
        success: false,
      });
    }
  },
};

export default productController;
