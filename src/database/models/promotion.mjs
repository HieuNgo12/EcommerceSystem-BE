import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dsxlqhn53/image/upload/v1730086754/promotion/default.jpg",
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"], // Loại giảm giá: phần trăm hoặc số tiền cố định
      required: true,
    },
    discountValue: {
      type: Number, // Giá trị giảm (phần trăm hoặc số tiền)
      required: true,
    },
    minimumOrderValue: {
      type: Number, // Giá trị đơn hàng tối thiểu để áp dụng khuyến mãi
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
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products", // Sản phẩm áp dụng chương trình khuyến mãi
      },
    ],
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Danh mục áp dụng khuyến mãi
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "expired"], // Trạng thái khuyến mãi
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

const PromotionModel = mongoose.model("Promotion", promotionSchema);

export default PromotionModel;
