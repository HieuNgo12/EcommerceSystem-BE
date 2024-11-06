import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    message: { type: String },
    email: { type: String },
    phone: { type: String },
    name: { type: String },
    image: { type: String },
    reply: {
      adminId: { type: String, ref: "user" },
      timeReply: { type: Date },
      statusReply: { type: Boolean, default: false },
      text: { type: String },
      note: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const SupportModel = mongoose.model("support", supportSchema);

export default SupportModel;
