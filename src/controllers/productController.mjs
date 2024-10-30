import ProductModel from "../database/models/product.mjs";
import { v2 as cloudinary } from "cloudinary";

const productController = {
  getProduct: async (req, res, next) => {
    try {
      const product = await ProductModel.find({})
      // .populate("reviewId");
      res.status(201).send({
        data: product,
        message: "User found successfully!",
        success: true,
      });
    } catch (e) {
      return res.status(403).send({
        message: e.message,
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
      const { title, category, color, description, price, slug, sku } =
        req.body;
      const file = req.file;

      if (!title) return res.status(400).send("title is required");
      if (!category) return res.status(400).send("category is required");
      if (!color) return res.status(400).send("color is required");
      if (!description) return res.status(400).send("description is required");
      if (!price) return res.status(400).send("price is required");
      if (!slug) return res.status(400).send("slug is required");
      if (!sku) return res.status(400).send("sku is required");

      const product = await ProductModel.create(req.body);

      if (!file) {
        res.status(200).send({
          data: product,
          message: "Add prodcut successful!",
          success: true,
        });
      } else {
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;
        
        cloudinary.uploader.upload(
          dataUrl,
          {
            public_id: product._id,
            resource_type: "auto",
            folder: "products",
            overwrite: true,
            // có thể thêm field folder nếu như muốn tổ chức
          },
          async (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Lỗi khi tải lên Cloudinary.", details: err });
            }

            if (result) {
              req.secure_url = result.secure_url;
              const updateData = await ProductModel.findByIdAndUpdate(
                product._id,
                {
                  image: result.secure_url,
                }
              );
              if (updateData) {
                res.status(200).send({
                  data: product,
                  message: "Add prodcut successful!",
                  success: true,
                });
              }
            }
          }
        );
      }
    } catch (error) {
      return res.status(500).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const updatedItem = req.body;
      const secure_url = req.secure_url;
      const productId = req.params.productId;
      console.log(updatedItem);
      if (secure_url) {
        const product = await ProductModel.findByIdAndUpdate(
          productId,
          { ...updatedItem, image: secure_url },
          { new: true }
        );
        if (product) {
          res.status(200).send({
            data: product,
            message: "product is updated successfully!",
            success: true,
          });
        } else {
          return res.status(400).send({
            message: "product is updated failed",
            data: null,
            success: false,
          });
        }
      } else {
        const product = await ProductModel.findByIdAndUpdate(
          productId,
          updatedItem,
          { new: true }
        );
        if (product) {
          res.status(200).send({
            data: product,
            message: "Product is updated successfully!",
            success: true,
          });
        } else {
          return res.status(400).send({
            message: "product is updated failed",
            data: null,
            success: false,
          });
        }
      }
    } catch (error) {
      return res.status(500).send({
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

      await cloudinary.uploader.destroy(
        `products/${productId}`,
        {
          resource_type: "image",
          folder: "products",
          // có thể thêm field folder nếu như muốn tổ chức
        },
        (error, result) => {
          if (error) {
            console.error("Error:", error);
          } else {
            console.log("Result:", result);
          }
        }
      );

      const deleteProduct = await ProductModel.findByIdAndDelete(productId);
      if (deleteProduct) {
        res.status(200).send({
          message: "Product is deleted successful!",
          success: true,
        });
      } else {
        return res.status(403).send({
          message: error.message,
          data: null,
          success: false,
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
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
