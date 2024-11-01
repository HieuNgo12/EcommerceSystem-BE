import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.SECRET_KEY;
const authMiddleware = {
  auhthorizationAdmin: (req, res, next) => {
    const userRole = req.user.role;
    if (userRole === "admin" || userRole === "super") {
      next(); // Cho phép truy cập vào route
    } else {
      console.log("check");
      return res.status(403).json({ message: "Forbidden. Only for admin" }); // Trả về lỗi 403 nếu không có quyền truy cập
    }
  },

  auhthorizationUser: (req, res, next) => {
    const userRole = req.user.role;
    if (userRole === "user") {
      next(); // Cho phép truy cập vào route
    } else {
      return res.status(403).send("Forbidden"); // Trả về lỗi 403 nếu không có quyền truy cập
    }
  },

  auhthorizationSuper: (req, res, next) => {
    const userRole = req.user.role;
    if (userRole === "super") {
      next(); // Cho phép truy cập vào route
    } else {
      return res.status(403).send("Forbidden"); // Trả về lỗi 403 nếu không có quyền truy cập
    }
  },

  authentication: async (req, res, next) => {
    try {
      const authorization = req.headers["authorization"]?.split(" ");
      if (Array.isArray(authorization)) {
        const token = authorization[1];
        if (token) {
          jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
              return res
                .status(403)
                .send({ message: "Invalid or expired token" });
            } else {
              req.user = decoded;
              next();
            }
          });
        } else {
          res.status(401).send({ message: "Unauthorized, token is missing" });
        }
      } else {
        res
          .status(401)
          .send({ message: "Unauthorized, no authorization header" });
      }
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },

  // refreshToken: async (req, res) => {
  //   const token =
  //     req.headers["authorization"] &&
  //     req.headers["authorization"].split(" ")[1];
  //   console.log(token);
  //   const decoded = jwtDecode(token);

  //   const dateNow = new Date();

  //   //token exprire
  //   if (decoded.exp < dateNow.getTime() / 1000) {
  //     const token = jwt.sign(
  //       { id: decoded.id, claim: decoded.claim },
  //       process.env.SECRET_KEY,
  //       {
  //         expiresIn: "1h",
  //       }
  //     );
  //     res.json({ accesstoken: token });
  //   } else {
  //     res.json({ token: token });
  //   }
  // },

  // refreshToken: async (req, res, next) => {
  //   try {
  //     const refreshToken = req.cookie.refreshToken;
  //     // console.log(refreshToken);

  //     // return res.status(200).send(refreshToken)
  //     if (!refreshToken) throw new Error("You are not authenticated.");
  //     const decoded = jwtDecode(refreshToken);
  //     console.log(decoded);
  //     jwt.verify(refreshToken, secretKey, (err, user) => {
  //       if (err) {
  //         console.log(err);
  //       }

  //       const userData = {
  //         id: user.id,
  //         email: user.email,
  //         role: user.role,
  //       };

  //       const newAccesstoken = jwt.sign(userData, secretKey, {
  //         expiresIn: "1h",
  //       });

  //       const newRefreshToken = jwt.sign(userData, secretKey);

  //       res.cookie("refreshToken", newRefreshToken, {
  //         httpOnly: true, // Cookie không thể truy cập qua JavaScript (bảo mật hơn)
  //         secure: false, // Sử dụng HTTPS trong production
  //         path: "/",
  //         sameSite: "None", // Cần thiết nếu frontend và backend ở các domain khác nhau
  //         maxAge: 3600000, // Thời hạn cookie 1 giờ
  //       });

  //       res.status(200).json({ data: newAccesstoken });
  //     });
  //   } catch (error) {
  //     return res.status(400).send({
  //       message: error.message,
  //       data: null,
  //       success: false,
  //     });
  //   }
  // }
};

export default authMiddleware;
