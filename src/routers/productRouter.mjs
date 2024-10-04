import authenticationController from "../controllers/authenticationController.mjs";
import productController from "../controllers/productController.mjs";

const ProductRouter = (app) => {
  app.get(
    "/product",
    //  authenticationController.isLogin,
    productController.getProduct
  );
  app.post(
    "/product",
    authenticationController.isAdmin,
    productController.postProduct
  );
  app.put(
    "/product",
    authenticationController.isAdmin,
    productController.updateProduct
  );
  // app.delete("/product/:productId",authenticationController.isAdmin, productController.deleteProduct);
  app.delete("/product/", productController.deleteAllProducts);

  app.post("/productData", productController.createProductData);
};
export default ProductRouter;
