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
      const authorization = req.headers["authorization"]?.split(" ");
      if (Array.isArray(authorization)) {
        const token = authorization[1];
        if (token) {
          jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
              return res.status(403).send({ message: "Invalid or expired token" });
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
};

export default authMiddleware;
