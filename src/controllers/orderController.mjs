const orderController = {
    getOrder: async (req, res, next) => {
      const order = await ProductModel.find({
        userName,
        email,
      });
      res.status(201).send({
        data: product,
        message: "User found successfully!",
        success: true,
      });
    },
    createOrder: async (req, res, next) => {
      const product = await ProductModel.create({
        title: "abc",
        categories: "abc",
      });
      res.status(201).send({
        data: product,
        message: "User found successfully!",
        success: true,
      });
    },
    updateOrder: (req, res, next) => {},
    deleteProduct: (req, res, next) => {},
  };
  export default cartController;
  