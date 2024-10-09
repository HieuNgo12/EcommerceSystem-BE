import authenticationController from "../controllers/authenticationController.mjs";
import productController from "../controllers/productController.mjs";

const ProductRouter = (app) => {
  app.get("/product", authenticationController.isUser, productController.getProduct);
  app.post("/product", authenticationController.isAdmin, productController.postProduct);
  app.put("/product", authenticationController.isAdmin,productController.updateProduct);
  app.delete("/product/:productId",authenticationController.isAdmin, productController.deleteProduct);
  app.get(
    "/api/v1/product",    productController.getProduct

    //  authenticationController.isLogin,
  );
  app.post(
    "/api/v1/product",
    authenticationController.isAdmin,
    productController.postProduct
  );
  app.put(
    "/api/v1/product",
    authenticationController.isAdmin,
    productController.updateProduct
  );
  // app.delete("/product/:productId",authenticationController.isAdmin, productController.deleteProduct);
  app.delete("/api/v1/product", productController.deleteAllProducts);

  app.post("/productData", productController.createProductData);
};
export default ProductRouter;
