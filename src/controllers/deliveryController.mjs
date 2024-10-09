import DeliveryModel from "../database/models/delivery.mjs";

const deliveryController = {
  getDelivery: async (req, res, next) => {
    const delivery = await DeliveryModel.find({})
      .populate("reviewId")
      .then((data) => 
      res.status(201).send({
        data: data,
        message: "Delivery found successfully!",
        success: true,
      }))
  },
  getDeliveryById: async (req, res, next) => {
    const deliveryId = req.params.deliveryId
    const delivery = await DeliveryModel.find({deliveryId});
    res.status(201).send({
      data: delivery,
      message: "Delivery found successfully!",
      success: true,
    });
  },
  postDelivery: async (req, res, next) => {
    const delivery = await DeliveryModel.create(req.body);
    res.status(201).send({
      data: delivery,
      message: "Delivery created successfully!",
      success: true,
    });
  },

  createDeliveryData: async (req, res, next) => {
    // console.log(req.body);
 
    const delivery = await DeliveryModel.insertMany(req.body);

    res.status(201).send({
      data: delivery,
      message: "User found successfully!",
      success: true,
    });
  },
  updateDelivery: async (req, res, next) => {
    const deliveryId = req.params.deliveryId

    const delivery = await DeliveryModel.findOneAndUpdate(deliveryId,req.body);
    res.status(201).send({
      data: delivery,
      message: "User found successfully!",
      success: true,
    });
  },
  deleteCoupon: async (req, res, next) => {
    const deliveryId = req.params.deliveryId

    const delivery = await DeliveryModel.deleteOne(deliveryId);
    res.status(201).send({
      data: delivery,
      message: "User found successfully!",
      success: true,
    });
  },
  deleteAllDeliverys: async (req, res, next) => {
    const delivery = await DeliveryModel.deleteMany({});
    res.status(201).send({
      data: delivery,
      message: "Delete All Deliverys successfully!",
      success: true,
    });
  },
};

export default deliveryController;
