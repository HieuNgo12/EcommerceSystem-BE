import PaymentModel from "../database/models/payment.mjs";

const paymentController = {
  getPayment: async (req, res, next) => {
    const payment = await PaymentModel.find({})
      .populate("reviewId")
      .then((data) => 
      res.status(201).send({
        data: data,
        message: "Payment found successfully!",
        success: true,
      }))
  },
  getPaymentById: async (req, res, next) => {
    const paymentId = req.params.paymentId
    const payment = await PaymentModel.find({paymentId});
    res.status(201).send({
      data: payment,
      message: "Payment found successfully!",
      success: true,
    });
  },
  postPayment: async (req, res, next) => {
    const payment = await PaymentModel.create(req.body);
    res.status(201).send({
      data: payment,
      message: "Payment created successfully!",
      success: true,
    });
  },

  createPaymentData: async (req, res, next) => {
    // console.log(req.body);
 
    const payment = await PaymentModel.insertMany(req.body);

    res.status(201).send({
      data: payment,
      message: "User found successfully!",
      success: true,
    });
  },
  updatePayment: async (req, res, next) => {
    const paymentId = req.params.paymentId

    const payment = await PaymentModel.findOneAndUpdate(paymentId,req.body);
    res.status(201).send({
      data: payment,
      message: "User found successfully!",
      success: true,
    });
  },
  deleteCoupon: async (req, res, next) => {
    const paymentId = req.params.paymentId

    const payment = await PaymentModel.deleteOne(paymentId);
    res.status(201).send({
      data: payment,
      message: "User found successfully!",
      success: true,
    });
  },
  deleteAllPayments: async (req, res, next) => {
    const payment = await PaymentModel.deleteMany({});
    res.status(201).send({
      data: payment,
      message: "Delete All Payments successfully!",
      success: true,
    });
  },
};

export default paymentController;
