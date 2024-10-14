import mongoose from "mongoose";

const orderModel = new mongoose.Schema(
  {

    userId: {
      type: String,

      ref: "user",
    },
    itemId: {
      type: String,

      ref: "products",
    },
    quantity: {
      type: Number,
    },
    firstName: {
      type: String,
    },
    companyName: {
      type: String,
    },
    subTotal: {
      type: Number,
    },
    streetAddress: {
      type: String,
    },
    apartment: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    emailAdress: {
      type: String,
    },
    townCity: {
      type: String,
    },
    couponCode: {
      type: String,
    },
    paymentMethod: {
      type: String,
      default: "Cash",
      enum: ["Cash", "Credit"],
    },
    cardNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Waiting", "Confirmed", "Cancelled", "Deliver", "Success"], //waiting, confirmed, deliver, success
      default: "Waiting",
    },
  },
  {
    timestamps: true,
  }
  //   dateEstimate: { type: Date },
);

const OrderModel = mongoose.model("orders", orderModel);

// const initializeOrderMode = async () => {
//   await OrderModel.create([
//     {
//       firstName: "John Smith",
//       companyName: "FPT",
//       address: "1234 ABC street",
//       apartment: "blk4",
//       town: "New York",
//       phoneNumber: "123456789",
//       email: "johnsmith@gmail.com",
//     },
//   ]);
// };

// initializeOrderMode();
export default OrderModel;
