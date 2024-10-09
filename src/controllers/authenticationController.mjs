import jwt from "jsonwebtoken";
import UsersModel from "../database/models/users.mjs";

const SECRET_KEY = "your_secret_key";

const authenticationController = {
  login: async (req, res, next) => {
    const { email, password } = req.body;
    // tìm thông tin user | tài khoản với email được gửi lên
    const currentUser = await UsersModel.findOne({ email });
    if (!currentUser) throw new Error("Sai tài khoản hoặc mật khẩu");

    const hashingPasswordLogin = bcrypt.hashSync(password, currentUser.salt);
    // compare password
    if (hashingPasswordLogin !== currentUser.password)
      throw new Error("Sai tài khoản hoặc mật khẩu");

    res.status(201).send({
      message: "Login successfully!",
      email,
      // v.v user info
    });
  },
  register: async (req, res, next) => {
    const { email, password } = req.body;
    // tìm thông tin user | tài khoản với email được gửi lên
    const currentUser = await UsersModel.findOne({ email });
    if (!currentUser) throw new Error("Sai tài khoản hoặc mật khẩu");

    const hashingPasswordLogin = bcrypt.hashSync(password, currentUser.salt);
    // compare password
    if (hashingPasswordLogin !== currentUser.password)
      throw new Error("Sai tài khoản hoặc mật khẩu");

    res.status(201).send({
      message: "Login successfully!",
      email,
      // v.v user info
    });
  },
  isLogin: async (req, res, next) => 
    {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(401).send({ err: "Token is expired" });
      }
      try {
        jwt.verify(token, process.env.SECRET_TOKEN);
        next();
      } catch (err) {
        res.status(400).send({ err: "Invalid Token" });
      }
    }
  ,
  isAdmin: async (req, res, next) => {
    const authorization = req.headers["authorization"]?.split(" ");

    if (Array.isArray(authorization)) {
      const token = authorization[1];

      if (token) {
        const [from, userId, email, ...otherInfo] = token.split("-");

        if (token == "admin") {
          next();
        }

        req.user = {
          from,
          userId,
          email,
          otherInfo,
        };

        return next();
      } else {
        res.status(403).send("Unauthorized");
      }
    } else {
      res.status(403).send("Unauthorized");
    }
  },
  forgotPassword: async (req, res, next) => {},
  usePasswordHashToMakeToken: async (req, res, next) => {
    const { password, _id, createdAt } = user;
    const secret = password + "-" + createdAt;
    const token = jwt.sign({ _id }, secret, {
      expiresIn: 15 * 60 * 1000, // 15 mins
    });
    // highlight-end
    return token;
  },
};
export default authenticationController;
