const { default: mongoose } = require("mongoose");
const { Job } = require("../model/jobModel");

const createJob = async (req, res) => {
  const { company, position } = req.body;
  req.body.createdBy = req.user.userID;
  try {
    if (!company || !position)
      return res.status(400).send({ message: "all fields are required" });
    const job = await Job.findOne({ company, position });
    if (job) return res.status(400).send({ message: "job already exists" });
    const newjob = await Job.create(req.body);
    return res.status(201).send(newjob);
  } catch (error) {
    next(error);
  }
};

const getAllJobs = async (req, res) => {
  const { status, workType, search } = req.query;
  try {
    const queryObject = {
      createdBy: req.user.userID,
    };
    if (status && status !== "all") {
      queryObject.status = status;
    }
    if (workType && workType !== "all") {
      queryObject.workType = workType;
    }
    if (search) {
      queryObject.position = { $regex: search, $options: "i" };
    }

    let queryResult = Job.find(queryObject);

    if (sort === "latest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "a-z") {
      queryResult = queryResult.sort("position");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("-position");
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    queryResult = queryResult.skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments(queryResult);
    const numOfPage = Math.ceil(totaljobs / limit);

    const jobs = await queryResult;

    if (!jobs)
      return res.status(200).send({
        message: "oops no jobs found",
        totalJobs,
        Jobs: { jobs },
        numOfPage,
      });
    return res.status(200).send({
      message: "Jobs found are as following",
      totalJobs,
      Jobs: { jobs },
      numOfPage,
    });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res) => {
  const jobId = req.params.id;
  if (!jobId)
    return res.status(400).send({ message: "jobId is required to update" });
  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(400).send({ message: "no job found" });
    const updatedJob = await Job.findByIdAndUpdate({ id: jobId }, req.body, {
      new: true,
    });
    return res.status(201).send({ job: updatedJob });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res) => {
  const jobId = req.params.id;
  if (!jobId)
    return res.status(400).send({ message: "jobId is required to delete" });
  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(400).send({ message: "no job found" });
    await Job.findByIdAndDelete({ id: jobId });
    return res.status(201).send({ message: "job deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getJobStats = async (req, res) => {
  const stats = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userID),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const defaultStats = {
    pending: stats.pending,
    reject: stats.reject,
    interview: stats.interview,
  };

  let monthlyApplication = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userID),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  res
    .status(200)
    .send({ TotalJobs: stats.length, defaultStats, monthlyApplication });
};

module.exports = { createJob, getAllJobs, updateJob, deleteJob, getJobStats };
