import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import UsersModel from "../database/models/users.mjs";

const FileController = {
  singleUploadForProduct: (req, res, next) => {
    const file = req.file;
    const productId = req.body.productId;
    if (!file) {
      return res.status(400).json({ error: "Không có tệp được tải lên." });
    }

    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    // const fileName = file.originalname.split(".")[0];

    cloudinary.uploader.upload(
      dataUrl,
      {
        public_id: productId,
        resource_type: "auto",
        folder: "products",
        overwrite: true,
        // có thể thêm field folder nếu như muốn tổ chức
      },
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Lỗi khi tải lên Cloudinary.", details: err });
        }

        if (result) {
          console.log(result.secure_url);
          // lấy secure_url từ đây để lưu vào database.
          req.secure_url = result.secure_url;

          // Trả về secure_url và thông tin khác sau khi tải lên thành công
          // return res.json({
          //   message: "Tệp được tải lên thành công.",
          //   secure_url: result.secure_url, // Trả về URL ảnh từ Cloudinary
          //   public_id: result.public_id,
          //   data: {
          //     fileName: file.originalname,
          //     mimetype: file.mimetype,
          //     size: file.size,
          //   },
          //   version: result.version,
          // });
        }
      }
    );
  },

  singleUpdateForProduct: (req, res, next) => {
    const file = req.file;
    const productId = req.params.productId;
    if (!file) {
      return next();
    }

    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    // const fileName = file.originalname.split(".")[0];

    cloudinary.uploader.upload(
      dataUrl,
      {
        public_id: productId,
        resource_type: "auto",
        folder: "products",
        overwrite: true,
        // có thể thêm field folder nếu như muốn tổ chức
      },
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Lỗi khi tải lên Cloudinary.", details: err });
        }

        if (result) {
          console.log(result.secure_url);
          // lấy secure_url từ đây để lưu vào database.
          req.secure_url = result.secure_url;
          next();
          // Trả về secure_url và thông tin khác sau khi tải lên thành công
          // return res.json({
          //   message: "Tệp được tải lên thành công.",
          //   secure_url: result.secure_url, // Trả về URL ảnh từ Cloudinary
          //   public_id: result.public_id,
          //   data: {
          //     fileName: file.originalname,
          //     mimetype: file.mimetype,
          //     size: file.size,
          //   },
          //   version: result.version,
          // });
        }
      }
    );
  },

  singleUploadForUser: (req, res, next) => {
    const file = req.file;
    const userId = req.user.userId;

    if (!userId) throw new Error("Please log in frist!");

    if (!file) throw new Error("File is not found!");

    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    // const fileName = file.originalname.split(".")[0];

    cloudinary.uploader.upload(
      dataUrl,
      {
        public_id: userId,
        resource_type: "auto",
        folder: "users",
        overwrite: true,
        // có thể thêm field folder nếu như muốn tổ chức
      },
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "File upload failed.", details: err });
        }

        if (result) {
          console.log(result.secure_url);

          // Trả về secure_url và thông tin khác sau khi tải lên thành công
          return res.status(200).json({
            message: "File uploaded successful.",
            secure_url: result.secure_url, // Trả về URL ảnh từ Cloudinary
            public_id: result.public_id,
            data: {
              fileName: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
            },
          });
        }
      }
    );
  },

  singleUpdateForUser: (req, res, next) => {
    const file = req.file;
    const userId = req.user.id;
    if (!userId) throw new Error("Please log in frist!");

    if (!file) {
      return next();
    }

    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    // const fileName = file.originalname.split(".")[0];

    cloudinary.uploader.upload(
      dataUrl,
      {
        public_id: userId,
        resource_type: "auto",
        folder: "users",
        overwrite: true,
        // có thể thêm field folder nếu như muốn tổ chức
      },
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "File upload failed.", details: err });
        }

        if (result) {
          console.log(result.secure_url);
          // lấy secure_url từ đây để lưu vào database.

          // Lưu URL ảnh và chuyển tiếp để tiếp tục xử lý thông tin user
          req.secure_url = result.secure_url;
          req.public_id = result.public_id;

          // Trả về secure_url và thông tin khác sau khi tải lên thành công
          next();
        }
      }
    );
  },

  singleUpdateForPromotion: (req, res, next) => {
    const file = req.file;
    const promotionId = req.params.promotionId;
    if (!promotionId) throw new Error("Please log in frist!");

    if (!file) {
      return next();
    }

    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    // const fileName = file.originalname.split(".")[0];

    cloudinary.uploader.upload(
      dataUrl,
      {
        public_id: promotionId,
        resource_type: "auto",
        folder: "promotion",
        overwrite: true,
        // có thể thêm field folder nếu như muốn tổ chức
      },
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "File upload failed.", details: err });
        }

        if (result) {
          req.secure_url = result.secure_url;
          req.public_id = result.public_id;
          next();
        }
      }
    );
  },

  singleUpdateForUserByAdmin: (req, res, next) => {
    const file = req.file;
    const userId = req.body.userId;
    if (!userId) throw new Error("Please log in frist!");

    if (!file) {
      return next();
    }

    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    // const fileName = file.originalname.split(".")[0];

    cloudinary.uploader.upload(
      dataUrl,
      {
        public_id: userId,
        resource_type: "auto",
        folder: "users",
        overwrite: true,
        // có thể thêm field folder nếu như muốn tổ chức
      },
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "File upload failed.", details: err });
        }

        if (result) {
          console.log(result.secure_url);
          // lấy secure_url từ đây để lưu vào database.

          // Lưu URL ảnh và chuyển tiếp để tiếp tục xử lý thông tin user
          req.secure_url = result.secure_url;
          req.public_id = result.public_id;

          // Trả về secure_url và thông tin khác sau khi tải lên thành công
          next();
        }
      }
    );
  },

  multiUploadForProduct: (req, res, next) => {
    console.log(req.files);
    const listFile = req.files;

    const listResult = [];

    if (!listFile || listFile.length === 0) {
      return res.status(400).json({ error: "Không có tệp được tải lên." });
    }

    try {
      for (const file of listFile) {
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;
        const fileName = file.originalname.split(".")[0];

        cloudinary.uploader.upload(
          dataUrl,
          {
            public_id: fileName,
            resource_type: "auto",
            overwrite: true,
            // có thể thêm field folder nếu như muốn tổ chức
          },
          (err, result) => {
            if (result) {
              listResult.push(result);
            }
          }
        );
      }
      res.json({ message: "Tệp được tải lên thành công.", data: listResult });
    } catch (err) {
      // Bắt bất kỳ lỗi nào trong quá trình xử lý và trả về phản hồi lỗi
      console.error("Lỗi trong quá trình tải lên:", err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi tải lên tệp.",
        details: err.message,
      });
    }
  },

  multiUploadForUser: (req, res, next) => {
    console.log(req.files);
    const listFile = req.files;

    const listResult = [];

    if (!listFile || listFile.length === 0) {
      return res.status(400).json({ error: "Không có tệp được tải lên." });
    }

    try {
      for (const file of listFile) {
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;
        const fileName = file.originalname.split(".")[0];

        cloudinary.uploader.upload(
          dataUrl,
          {
            public_id: fileName,
            resource_type: "auto",
            overwrite: true,
            // có thể thêm field folder nếu như muốn tổ chức
          },
          (err, result) => {
            if (result) {
              listResult.push(result);
            }
          }
        );
      }
      res.json({ message: "Tệp được tải lên thành công.", data: listResult });
    } catch (err) {
      // Bắt bất kỳ lỗi nào trong quá trình xử lý và trả về phản hồi lỗi
      console.error("Lỗi trong quá trình tải lên:", err);
      res.status(500).json({
        error: "Đã xảy ra lỗi khi tải lên tệp.",
        details: err.message,
      });
    }
  },
};

export default FileController;
