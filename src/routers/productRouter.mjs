import authenticationController from "../controllers/authenticationController.mjs";
import productController from "../controllers/productController.mjs";

const ProductRouter = (app) => {
  // Route to get all products
  app.get(
    "/all-products",
    authenticationController.isUser,
    productController.getAllProducts
  );

  // Route to get a specific product by ID
  app.get("/:productId", productController.getProductById);

  // app.post(
  //   "/product",
  //   authenticationController.isAdmin,
  //   productController.postProduct
  // );
  // app.put(
  //   "/product",
  //   authenticationController.isAdmin,
  //   productController.updateProduct
  // );
  // app.delete(
  //   "/product/:productId",
  //   authenticationController.isAdmin,
  //   productController.deleteProduct
  // );

  // //  authenticationController.isLogin,

  // app.post(
  //   "/api/v1/product",
  //   authenticationController.isAdmin,
  //   productController.postProduct
  // );
  // app.put(
  //   "/api/v1/product",
  //   authenticationController.isAdmin,
  //   productController.updateProduct
  // );
  // // app.delete("/product/:productId",authenticationController.isAdmin, productController.deleteProduct);
  // app.delete("/api/v1/product", productController.deleteAllProducts);

  // app.post("/productData", productController.createProductData);
};
export default ProductRouter;
