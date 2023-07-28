const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const { createToken } = require("../services/auth");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) next("all fields are must");
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedpassword,
    });
    return res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) next("all fields are must");
    const user = await findOne({ email });
    if (!user) return res.status(400).send({ message: "user doesn't exist" });
    if (await bcrypt.compare(password, user.password)) {
      const token = createToken(user);
      res.cookie("token", token);
      return res.status(200).send({ message: "login successful", token });
    } else return res.status(200).send({ message: "wrong password" });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res) => {
  const user = req.body;
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: "user not found" });
    if (await bcrypt.compare(password, user.password)) {
      const updatedUser = await User.findOneAndUpdate({ email }, req.body, {
        new: true,
      });
      return res.status(201).send(updatedUser);
    } else {
      return res.status(400).send({ message: "user updation unsuccessful" });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { registerUser, loginUser, updateUser };
