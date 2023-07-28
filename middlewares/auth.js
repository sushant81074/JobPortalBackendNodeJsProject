const { verifyToken } = require("../services/auth");

const authenticator = (req, res, next) => {
  const token = req.cookie?.token;
  if (!token)
    return res.status(400).send({ message: "unvalid user please first login" });
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send(message);
  }
};

module.exports = { authenticator };
