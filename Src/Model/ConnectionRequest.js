const mongoose = require("mongoose");

const ConnectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      unum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `Entered value : {VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

ConnectionRequestSchema.index({ fromUserId: 1 }, { toUserId: 1 });

ConnectionRequestSchema.pre("save", function (next) {
  connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Invalid connection request");
  }
  next();
});

module.exports = new mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema
);
