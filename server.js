const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
dotenv.config();

const homeRouter = require("./routes/homeRoute");
const userRouter = require("./routes/userRouter");
const jobRouter = require("./routes/jobRoute");
const { errorHandler } = require("./middlewares/errorMiddleware");

mongoose
  .connect("mongodb://localhost/jobPortalDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.use(express.json());
app.use(cookieParser());

app.use("/", homeRouter.router);
app.use("/user", userRouter.router);
app.use("/job", jobRouter.router);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`server is running on port : ${process.env.PORT}`);
});
