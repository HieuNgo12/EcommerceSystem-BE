import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.SECRET_KEY;
const authMiddleware = {
  auhthorizationAdmin: (req, res, next) => {
    const userRole = req.user.role;
    if (userRole === "admin") {
      next(); // Cho phép truy cập vào route
    } else {
      res.status(403).send("Forbidden"); // Trả về lỗi 403 nếu không có quyền truy cập
    }
  },

  auhthorizationUser: (req, res, next) => {
    const userRole = req.user.role;
    if (userRole === "user") {
      next(); // Cho phép truy cập vào route
    } else {
      res.status(403).send("Forbidden"); // Trả về lỗi 403 nếu không có quyền truy cập
    }
  },

  authentication: async (req, res, next) => {
    try {
      const token = req.cookies["auth_token"]; // Lấy token từ cookie
      // const authorization = req.headers["authorization"]?.split(" ");
      // if (Array.isArray(authorization)) {
      //   const token = authorization[1];

      if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            console.error("JWT verification failed:", err.message);
          } else {
            req.user = decoded;
            // console.log(decoded);
            next();
          }
        });
      } else {
        res.status(403).send("Unauthorized");
      }
      // }
      //  else {
      //   res.status(403).send("Unauthorized");
      // }
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).send("Invalid or expired token");
    }
  },
  
  refreshToken: async (req, res, next) => {},
};

export default authMiddleware;
