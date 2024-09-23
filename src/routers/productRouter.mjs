import productController from "../controllers/productController.mjs";

const ProductRouter = (app) => {
  app.get("/product", productController.getProduct);
  app.post("/product", productController.postProduct);
  app.put("/product", productController.updateProduct);
  app.delete("/product/:productId", productController.deleteProduct);

};
export default ProductRouter;
