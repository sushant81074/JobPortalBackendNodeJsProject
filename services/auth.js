const jwt = require("jsonwebtoken");
const secretKey = "a1b2c3d4e5f6g7h8";

const createToken = (req, res, next) => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const token = jwt.sign(payload, secretKey);
  return token;
};

const verifyToken = (req, res, next) => {
  const payload = jwt.sign(token, secretKey);
  return payload;
};

module.exports = { createToken, verifyToken };
