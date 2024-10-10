import ProductModel from "../database/models/product.mjs";

const productController = {
  getProduct: async (req, res, next) => {
    try {
      const product = await ProductModel.find({}).populate("reviewId");
      res.status(201).send({
        data: product,
        message: "User found successfully!",
        success: true,
      });
    } catch {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  getProductById: async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const product = await ProductModel.findById(productId);

      console.log(product);
      res.status(201).send({
        data: product,
        message: "User found successfully!",
        success: true,
      });
    } catch (error) {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  getCategoryById: async (req, res, next) => {
    try {
      const categoryId = req.params.categoryId;
      const product = await ProductModel.findOne({ category: categoryId });

      console.log(product);
      res.status(201).send({
        data: product,
        message: "User found successfully!",
        success: true,
      });
    } catch (error) {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  addProduct: async (req, res, next) => {
    try {
      const { title, category, color, image, description, price, slug, sku } =
        req.body;
      if (!title) throw new Error("title is required");
      if (!category) throw new Error("category is required");
      if (!color) throw new Error("color is required");
      if (!image) throw new Error("image is required");
      if (!description) throw new Error("description is required");
      if (!price) throw new Error("price is required");
      if (!slug) throw new Error("slug is required");
      if (!sku) throw new Error("sku is required");

      const product = await ProductModel.create(req.body);
      res.status(201).send({
        data: product,
        message: "add prodcut successfully!",
        success: true,
      });
    } catch (error) {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const updatedItem = req.body;
      const productId = req.params.productId;
      const product = await ProductModel.findByIdAndUpdate(
        productId,
        updatedItem,
        { new: true }
      );
      if (product) {
        res.status(200).send({
          data: product,
          message: "product is updated successfully!",
          success: true,
        });
      } else {
        return res.status(403).send({
          message: "product is updated failed",
          data: null,
          success: false,
        });
      }
    } catch (error) {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  updateAllProduct: async (req, res, next) => {
    try {
      const updatedItem = req.body;
      const productId = req.params.productId;
      const product = await ProductModel.findByIdAndUpdate(
        productId,
        updatedItem,
        { new: true, overwrite: true }
      );
      if (product) {
        res.status(200).send({
          data: product,
          message: "product is updated successfully!",
          success: true,
        });
      } else {
        return res.status(403).send({
          message: "product is updated failed",
          data: null,
          success: false,
        });
      }
    } catch (error) {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const deleteProduct = await ProductModel.findByIdAndDelete(productId);
      if (deleteProduct) {
        res.status(201).send({
          message: "product is deleted successfully!",
          success: true,
        });
      } else {
        return res.status(403).send({
          message: "product is deleted failed",
          data: null,
          success: false,
        });
      }
    } catch (error) {
      return res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
};

export default productController;
