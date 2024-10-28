import mongoose from "mongoose";

const voucherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    user: {
      phone: { type: String, required: true },
      useDate: { type: Date, default: Date.now },
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"], // Phần trăm hoặc số tiền cố định
      required: true,
    },
    discountValue: {
      type: Number, // Giá trị giảm (phần trăm hoặc số tiền)
      required: true,
    },
    minimumOrderValue: {
      type: Number, // Giá trị đơn hàng tối thiểu để áp dụng voucher
      default: 0,
    },
    maxDiscount: {
      type: Number, // Số tiền giảm tối đa (nếu có)
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number, // Giới hạn số lần sử dụng voucher
      default: null,
    },
    usedCount: {
      type: Number, // Số lần voucher đã được sử dụng
      default: 0,
    },
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Áp dụng cho các sản phẩm cụ thể
      },
    ],
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Áp dụng cho các danh mục cụ thể
      },
    ],
    applicableUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Áp dụng cho người dùng cụ thể (nếu cần)
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "expired"], // Trạng thái voucher
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const VoucerModel = mongoose.model("voucher", voucherSchema);

export default VoucerModel;
