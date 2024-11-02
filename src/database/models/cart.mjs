import mongoose from "mongoose";
import ProductModel from "./product.mjs";

const cartModel = new mongoose.Schema(
  {
    userId: {
      type: String,
      
    },
    items: [
      {
        _id: false,
        item: {
          type: mongoose.Schema.Types.ObjectId,
          
          ref: "product",
        },
        quantity: {
          type: String,
          
        },
      },
    ],
  },
  { autoCreate: true, autoIndex: true }
);

const CartModel = mongoose.model("cart", cartModel);
export default CartModel;
