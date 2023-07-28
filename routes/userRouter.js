const {
  registerUser,
  loginUser,
  updateUser,
} = require("../controller/userController");
const { authenticator } = require("../middlewares/auth");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/update_user", authenticator, updateUser);

module.exports = { router };
