const router = require("express").Router();

const {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getJobStats,
} = require("../controller/jobController");
const { authenticator } = require("../middlewares/auth");

router.get("/", authenticator, getAllJobs);
router.post("/createJob", authenticator, createJob);
router.patch("/updateJob/:id", authenticator, updateJob);
router.delete("/deleteJob/:id", authenticator, deleteJob);
router.get("/getStats", authenticator, getJobStats);

module.exports = { router };
