import mongoose from "mongoose";

const orderModel = new mongoose.Schema({
  firstName: { type: String, required: true },
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  apartment: { type: String },
  town: { type: String, required: true },
  phoneNumber: { type: String },
  email: { type: String, required: true },
  dateEstimate: { type: Date },
});

const OrderModel = mongoose.model("orders", orderModel);

const initializeOrderMode = async () => {
  await OrderModel.create([
    {
      firstName: "John Smith",
      companyName: "john.smith@gmail.com",
      address: "1234 ABC street",
      apartment: "blk4",
      town: "New York",
      phoneNumber: "123456789",

    },
  ]);
};

initializeOrderMode();
export default OrderModel;
