const express = require("express");
const authRouter = express.Router();
const { validateLoginData } = require("../Utilse/Validation");
// const User = require("../Src/Model/User");
const User = require("../Model/User");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    //Validate the data
    validateLoginData(req);

    //Encrypt the password
    const { firstName, lastName, emailId, password } = req?.body;
    const hashPassword = await bcrypt.hash(password, 10);
    // console.log(hashPassword);

    //Send the data
    const addUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    const newUser = await addUser.save();
    // CREATE A JWT TOKEN
    const token = await newUser.getJWT();
    // STORE JWT TOKEN INTO AN COOKIE
    res.cookie("token", token, {
      expires: new Date(Date.now() + 900000),
    });

    res.json({
      message: "User added successfully!",
      data: newUser,
    });
  } catch (err) {
    res.status(400).send("Something When Wrong :( ERROR :" + " " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req?.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Enter a valid email address");
    } else {
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("Incorrect Credentials");
      } else {
        const isPasswordValid = await user.verifyPassword(password);
        if (isPasswordValid) {
          // CREATE A JWT TOKEN
          const token = await user.getJWT();
          // STORE JWT TOKEN INTO AN COOKIE
          res.cookie("token", token, {
            expires: new Date(Date.now() + 900000),
          });
          // res.send("Login Successful");
          res.json({
            message: "Login successful",
            user,
          });
        } else {
          throw new Error("Incorrect Credentials");
        }
      }
    }
  } catch (err) {
    res.status(400).send("Something When Wrong :( ERROR :" + " " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  // res.cookie("token", null, {
  //   expires: new Date(Date.now()),
  // });
  // res.send("User logout successfully!");
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("User logout successfully!");
});
module.exports = authRouter;
