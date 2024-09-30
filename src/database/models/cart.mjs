import mongoose from "mongoose";

const cartModel = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    apartment: { type: String },
    town: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String, required: true },
    user: {
      type: mongoose.type.ObjectId,
      ref: "user",
    },
  },
  { autoCreate: true, autoIndex: true }
);

const CartModel = mongoose.model("cart", cartModel);
export default CartModel;
