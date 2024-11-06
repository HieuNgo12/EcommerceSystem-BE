import UsersModel from "../database/models/users.mjs";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import PromotionModel from "../database/models/promotion.mjs";
import mongoose from "mongoose";

const secretKey = process.env.SECRET_KEY || "mysecretkey";
const saltRounds = 10;

const PromotionController = {
  getPromotion: async (req, res, next) => {
    try {
      const promotion = await PromotionModel.find().populate(
        "applicableProducts",
        "title"
      );

      const currentDate = new Date();
      await Promise.all(
        promotion.map(async (item) => {
          const plainItem = item.toObject();
          const startDate = new Date(plainItem.startDate);
          const endDate = new Date(plainItem.endDate);

          if (endDate < currentDate) {
            await PromotionModel.findByIdAndUpdate(item._id, {
              status: "expired",
            });
          } else if (startDate > currentDate) {
            await PromotionModel.findByIdAndUpdate(item._id, {
              status: "inactive",
            });
          } else if (startDate <= currentDate && endDate >= currentDate) {
            await PromotionModel.findByIdAndUpdate(item._id, {
              status: "active",
            });
          }
        })
      );

      if (promotion) {
        return res.status(200).json({
          data: promotion,
          success: true,
          message: "Get promotion successful",
        });
      }
    } catch (error) {
      console.log("error : ", error);
      return res.status(500).json({
        data: null,
        success: false,
        message: "Get promotion false",
      });
    }
  },

  addPromtion: async (req, res, next) => {
    try {
      const file = req.file;
      const {
        code,
        discountType,
        discountValue,
        startDate,
        endDate,
        dataApplicableProducts,
      } = req.body;

      const request = {
        code: code,
        discountType: discountType,
        discountValue: discountValue,
        startDate: startDate,
        endDate: endDate,
        dataApplicableProducts: dataApplicableProducts,
      };

      for (let i in request) {
        if (!request[i]) {
          return res.status(400).json({
            data: null,
            message: `${i} is required!`,
            success: false,
          });
        }
      }

      const checkCode = await PromotionModel.findOne({
        code,
      });
      if (checkCode) {
        return res.status(400).json({
          data: null,
          message: "Code already exists",
          success: false,
        });
      }

      const newStartDate = new Date(req.body.startDate);
      const newEndDate = new Date(req.body.endDate);
      const currentDate = new Date();

      if (newStartDate < currentDate) {
        return res.status(400).json({
          data: null,
          message: "The start date cannot be less than the current date",
          success: false,
        });
      }

      if (newStartDate > newEndDate) {
        return res.status(400).json({
          data: null,
          message: "The start date cannot be less than the end date",
          success: false,
        });
      }

      const promotion = await PromotionModel.create(req.body);
      if (!file) {
        return res.status(200).json({
          data: promotion,
          message: "Create promotion successful",
          success: true,
        });
      } else {
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;

        cloudinary.uploader.upload(
          dataUrl,
          {
            public_id: promotion._id,
            resource_type: "auto",
            folder: "promotion",
            overwrite: true,
          },
          async (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "File upload failed.", details: err });
            }

            if (result) {
              const updateImage = await PromotionModel.findByIdAndUpdate(
                promotion._id,
                { image: result.secure_url }
              );
              if (updateImage) {
                return res.status(200).json({
                  data: updateImage,
                  message: "Create promotion successful",
                  success: true,
                });
              }
            }
          }
        );
      }
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({
        data: null,
        message: error,
        success: false,
      });
    }
  },

  updatePromotion: async (req, res, next) => {
    try {
      const promotionId = req.params.promotionId;
      const secure_url = req.secure_url;
      let dataApplicableProducts = req.body.applicableProducts;
      if (!dataApplicableProducts) {
        if (secure_url) {
          const dataPromotion = await PromotionModel.findOneAndUpdate(
            { _id: promotionId },
            { ...req.body, image: secure_url },
            { new: true }
          );

          if (!dataPromotion) {
            return res.status(400).json({
              data: null,
              message: "Update is failed",
              success: false,
            });
          } else {
            return res.status(200).json({
              data: null,
              message: "Update is successful",
              success: false,
            });
          }
        } else {
          const dataPromotion = await PromotionModel.findByIdAndUpdate(
            promotionId,
            req.body,
            {
              new: true,
            }
          );

          if (!dataPromotion) {
            return res.status(400).json({
              data: null,
              message: "Update is failded",
              success: false,
            });
          } else {
            return res.status(200).json({
              data: null,
              message: "Update is successful",
              success: false,
            });
          }
        }
      } else {
        if (typeof dataApplicableProducts === "string") {
          dataApplicableProducts = dataApplicableProducts.split(",");
        }

        const productIds = dataApplicableProducts.map((id) =>
          mongoose.Types.ObjectId(id.trim())
        );
        if (secure_url) {
          const dataPromotion = await PromotionModel.findOneAndUpdate(
            { _id: promotionId },
            { ...req.body, applicableProducts: productIds, image: secure_url },
            { new: true }
          );

          if (!dataPromotion) {
            return res.status(400).json({
              data: null,
              message: "Update is failded",
              success: false,
            });
          } else {
            return res.status(200).json({
              data: null,
              message: "Update is successful",
              success: false,
            });
          }
        } else {
          const dataPromotion = await PromotionModel.findByIdAndUpdate(
            promotionId,
            { ...req.body, applicableProducts: productIds },
            {
              new: true,
            }
          );

          if (!dataPromotion) {
            return res.status(400).json({
              data: null,
              message: "Update is failded",
              success: false,
            });
          } else {
            return res.status(200).json({
              data: null,
              message: "Update is successful",
              success: false,
            });
          }
        }
      }
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({
        data: null,
        message: error,
        success: false,
      });
    }
  },

  // downPrice: async (req, res, next) => {
  //   const { code, discountType, discountValue, startDate, endDate } = req.body;
  //   const promotion = req.promotion;
  //   if()
  // },

  deletePromotion: async (req, res, next) => {
    try {
      const promotionId = req.params.promotionId;
      await cloudinary.uploader.destroy(
        `promotion/${promotionId}`,
        {
          resource_type: "image",
          folder: "promotion",
        },
        (error, result) => {
          if (error) {
            console.error("Error:", error);
          } else {
            console.log("Result:", result);
          }
        }
      );

      const deletePromotion = await PromotionModel.findByIdAndDelete(
        promotionId
      );

      if (deletePromotion) {
        return res.status(200).json({
          data: null,
          message: "Delete is successful",
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({
        data: null,
        message: error,
        success: false,
      });
    }
  },
};

export default PromotionController;
