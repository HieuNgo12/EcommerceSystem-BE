import { JsonWebTokenError } from "jsonwebtoken";

const tokenMiddlewares = {
  usePasswordHashToMakeToken: (user) => {
    // highlight-start
    const { password, _id, createdAt } = user;
    const secret = password + "-" + createdAt;
    const token = JsonWebTokenError.sign({ _id }, secret, {
      expiresIn: 15 * 60 * 1000, // 15 mins
    });
    // highlight-end
    return token;
  },
  verifyToken: (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
      return res.status(401).send({ err: "Token is expired" });
    }
    try {
      jwt.verify(token, process.env.SECRET_TOKEN);
      next();
    } catch (err) {
      res.status(400).send({ err: "Invalid Token" });
    }
  },
};

export default tokenMiddlewares;
