const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../Middlewares/Auth");
const ConnectionRequest = require("../Model/ConnectionRequest");
const User = require("../Model/User");

const USER_SAVE_DATA = "firstName lastName gender age about photoUrl skills";

userRouter.get("/user/request/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "gender",
      "about",
    ]);

    if (!connectionRequests) {
      res.send("No requests found");
    }

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(404).send("Something When Wrong :( ERROR :" + " " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("toUserId", USER_SAVE_DATA)
      .populate("fromUserId", USER_SAVE_DATA);

    const data = connectionRequests.map((Row) => {
      if (Row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return Row.toUserId;
      }
      return Row.fromUserId;
    });

    res.json({
      message: "Data fetched successfully",
      data,
    });
  } catch (err) {
    res.status(404).send("Something went wrong :( ERROR" + " " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("toUserId fromUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.toUserId.toString());
      hideUsersFromFeed.add(request.fromUserId.toString());
    });

    const userFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAVE_DATA)
      .limit(limit)
      .skip(skip);

    res.json({
      message: "Data fetched successfully",
      data: userFeed,
    });
  } catch (err) {
    res
      .status(404)
      .send("Something went wrong :( : ERROR :" + " " + err.message);
  }
});

module.exports = userRouter;
