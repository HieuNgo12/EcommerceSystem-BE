import ReviewModel from "../database/models/review.mjs";
import ProductModel from "../database/models/product.mjs";
import UsersModel from "../database/models/users.mjs";
import SupportModel from "../database/models/support.mjs";

const supportController = {
  addSupport: async (req, res) => {
    try {
      const support = await SupportModel.create(req.body);
      res.status(200).send({
        data: support,
        message: "Success"
      });
    } catch (e) {
      console.log(e);
    }
  },
};

export default supportController;
