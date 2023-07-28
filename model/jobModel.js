const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: [true, "company name is required"] },
    position: { type: String, required: [true, ""], minlength: 50 },
    status: {
      type: String,
      enum: ["pending", "reject", "interview"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["part-time", "full-time", "internship", "contract"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      enum: ["hydrabad", "banglore", "delhi"],
      default: "banglore",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
