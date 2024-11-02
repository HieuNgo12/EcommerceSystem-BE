const verifyIfUserCanPost = () => {
  const token = req.header("Authorization")[1];
  if (!token) {
    return res.status(401).send({ err: "Token is expired" });
  }
  try {
    const data = jwt.verify(token, process.env.SECRET_TOKEN);
  } catch (err) {
    console.log(err);
  }
};

export default verifyIfUserCanPost;
