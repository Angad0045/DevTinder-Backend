const express = require("express");
const connectionRequestRouter = express.Router();
const { userAuth } = require("../Middlewares/Auth");
const ConnectionRequest = require("../Model/ConnectionRequest");
const User = require("../Model/User");

connectionRequestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req?.user?._id;
      const { toUserId, status } = req?.params;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: `${status} is invalid status type`,
        });
      }

      const checkIfRecevierExists = await User.findById(toUserId);
      if (!checkIfRecevierExists) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const checkIfConnectionRequestAlreadyExists =
        await ConnectionRequest.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
        });

      if (checkIfConnectionRequestAlreadyExists) {
        return res
          .status(400)
          .json({ message: "Connection request already exists" });
      }

      const connectionRequest = await new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request send successfully",
        data,
      });
    } catch (err) {
      res
        .status(404)
        .send("Something When Wrong :( ERROR :" + " " + err.message);
    }
  }
);

connectionRequestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req?.user;
      const { status, requestId } = req?.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: `${status} is invalid status type`,
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: `Connection request ${status}`,
        data,
      });
    } catch (err) {
      res
        .status(404)
        .send("Something When Wrong :( ERROR :" + " " + err.message);
    }
  }
);

module.exports = connectionRequestRouter;
