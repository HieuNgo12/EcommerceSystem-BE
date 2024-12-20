import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    otp: { type: String, require: true },
    email: { type: String, require: true },
    purpose : { type: String , require : true, enum: ["ResetPassword","VerificationEmail", "VerificationPhone", "ConfirmOrder"],},
    phone : { type: String , require : true},
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    //   // TTL: Tự động xóa tài liệu sau 5 phút (5 phút = 300 giây)
    //   expires: 315, // 5 phút 15 giây tính bằng giây
    // },
  },
  { timestamps: true }
);

const OtpModel = mongoose.model("otp", OtpSchema);

export default OtpModel;
