const homeController = (req, res) => {
  res.status(200).send({ message: "HOME PAGE BITCHES" });
};

module.exports = { homeController };
