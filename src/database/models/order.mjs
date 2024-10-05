import mongoose from "mongoose";

const orderModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "user",
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,

          ref: "products",
        },
        quantity: {
          type: String,
        },
      },
    ],
    name: {
      type: String,
    },
    totalAmount: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
      enum: ["waiting", "confirmed", "deliver", "success"], //waiting, confirmed, deliver, success
      default: "waiting",
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
