const User = require("../Model/User");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Token Invalid or User is not logged In!");
    } else {
      const decodeToken = jwt.verify(token, "9321550431Angad@");
      const { _id } = decodeToken;

      const user = await User.findById(_id);
      if (!user) {
        throw new Error("User not found");
      } else {
        req.user = user;
        next();
      }
    }
  } catch (err) {
    res.status(404).send("Something When Wrong :( ERROR :" + " " + err.message);
  }
};

module.exports = {
  userAuth,
};
