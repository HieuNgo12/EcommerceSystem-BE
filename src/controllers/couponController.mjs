import CouponModel from "../database/models/coupon.mjs";
import OrderModel from "../database/models/order.mjs";

const couponController = {
  getCoupon: async (req, res, next) => {
    console.log(req.query.couponCodeName);
    const coupon = await CouponModel.findOne({
      couponCodeName: req.query.couponCodeName,
    });
    await CouponModel.findOneAndUpdate(
      {
        couponCodeName: req.query.couponCodeName,
      },
      {
        status: "Used",
      }
    );

    console.log(coupon);
    res.status(201).send({
      data: coupon,
      message: "Coupon found successfully!",
      success: true,
    });
    const order = await OrderModel.findOne({
      _id: req.query.order,
    });
    if (Number(coupon?.discount) > Number(order?.amount)) {
      await OrderModel.findOneAndUpdate(
        {
          _id: req.query.order,
        },
        { amount: 0 }
      );
    } else {
      await OrderModel.findOneAndUpdate(
        {
          _id: req.query.order,
        },
        { $inc: { amount: -Number(coupon?.discount) } }
      );
    }
  },
  getCouponById: async (req, res, next) => {
    const couponId = req.params.couponId;
    const coupon = await CouponModel.find({ couponId });
    res.status(201).send({
      data: coupon,
      message: "Coupon found successfully!",
      success: true,
    });
  },
  postCoupon: async (req, res, next) => {
    const coupon = await CouponModel.create(req.body);
    res.status(201).send({
      data: coupon,
      message: "Coupon created successfully!",
      success: true,
    });
  },

  createCouponData: async (req, res, next) => {
    const coupon = await CouponModel.insertMany(req.body);

    res.status(201).send({
      data: coupon,
      message: "User found successfully!",
      success: true,
    });
  },
  updateCoupon: async (req, res, next) => {
    const couponId = req.params.couponId;

    const coupon = await CouponModel.findOneAndUpdate(couponId, req.body);
    res.status(201).send({
      data: coupon,
      message: "User found successfully!",
      success: true,
    });
  },
  deleteCoupon: async (req, res, next) => {
    const couponId = req.params.couponId;

    const coupon = await CouponModel.deleteOne(couponId);
    res.status(201).send({
      data: coupon,
      message: "User found successfully!",
      success: true,
    });
  },
  deleteAllCoupons: async (req, res, next) => {
    const coupon = await CouponModel.deleteMany({});
    res.status(201).send({
      data: coupon,
      message: "Delete All Coupons successfully!",
      success: true,
    });
  },
};

export default couponController;
