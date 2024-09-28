import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

const authenticationController = {
  login: async (req, res, next) => {
    const { username, password } = req.body;
    const user = UserModel.find({ username });
    if (user && user.password === password) {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ token });
      next();

    } 
    res.status(403).send("Unauthorized");
},
  isLogin: async (req, res, next) => {
    next();
  },
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
};
export default authenticationController;
