const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middlewares/Auth");
const { validateEditProfileData } = require("../Utilse/Validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Something When Wrong :( ERROR :" + " " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Entered field cannot be edited");
    }
    //GETTING THE DATA OF USER WHOSE PROFILE IS EDIETD
    const loggedInUser = req?.user;
    //LOOPING THROUGH AND UPDATING ALL EDITED DATA
    Object.keys(req?.body).forEach(
      (key) => (loggedInUser[key] = req?.body[key])
    );
    //SAVING THE UPDATED DATA IN DATABASE
    await loggedInUser.save();
    //SENDING THE RESPONSE
    // res.send(`${loggedInUser.firstName}'s profile data is updated`);
    res.json({
      message: `${loggedInUser.firstName}'s profile data is updated`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Something When Wrong :( ERROR :" + " " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req?.body;

    const loggedInUser = req?.user;
    const loggedInUserPassword = loggedInUser?.password;

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      loggedInUserPassword
    );

    if (!isPasswordValid) {
      throw new Error("Password did not match");
    }

    //CHECKING IF NEW PASSWORD IS STRONG OR NOT
    const isStong = validator.isStrongPassword(newPassword);

    if (!isStong) {
      throw new Error("Enter a strong password");
    }

    //HASHING NEW PASSWORD BEFORE SAVING
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    //UPDATING THE PASSWORD
    loggedInUser.password = hashedNewPassword;

    await loggedInUser.save();
    // console.log("Password updated successfully");

    res.json({
      message: `${loggedInUser.firstName} updated his password`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Something When Wrong :( ERROR :" + " " + err.message);
  }
});

module.exports = profileRouter;
