const router = require("express").Router();

const { homeController } = require("../controller/homeController");
const { authenticator } = require("../middlewares/auth");

router.get("/", authenticator, homeController);

module.exports = { router };
