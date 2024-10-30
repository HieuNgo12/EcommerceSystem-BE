import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    message: { type: String },
    email: { type: String},
    phone: { type: String },
    phone: { name: String},

  },
  { timestamps: true }
);

const SupportModel = mongoose.model("support", supportSchema);

export default SupportModel;
