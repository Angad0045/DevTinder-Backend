const express = require("express");
const connectDB = require("./Config/Database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 3000;

app.use("/", cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/", express.json());
app.use("/", cookieParser());

const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const connectionRequestRouter = require("./Routes/connectionRequest");
const userRouter = require("./Routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("DATABASE CONNECTED....");
    app.listen(port, () => {
      console.log("Your server is up and running");
    });
  })
  .catch((err) => {
    console.log("SOMETHING WENT WRONG");
  });
