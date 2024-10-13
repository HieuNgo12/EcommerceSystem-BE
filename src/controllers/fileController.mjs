import { v2 as cloudinary } from "cloudinary";

const FileController = {
  singleUploadForUser: (req, res, next) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Không có tệp được tải lên." });
    }

    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    const fileName = file.originalname.split(".")[0];

    cloudinary.uploader.upload(
      dataUrl,
      {
        public_id: fileName,
        resource_type: "auto",
        folder: "users",
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
        }
      }
    );
    res.json({ message: "Tệp được tải lên thành công.", data: file });
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
