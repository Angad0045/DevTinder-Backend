//Step 1 - Require Mongoose
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// Create a Schema
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 25,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      // trim: true,
      // lowercase: true,
      // minLength: 5,
      // maxLength: 50,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(value + " " + "is not a valid email Id");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // minLength: 8,
      // maxLength: 25,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(value + " " + "is not a strong password");
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error(value + " " + "is not a valid gender");
        }
      },
    },
    about: {
      type: String,
      required: true,
      default: "Enter your short description",
    },

    photoUrl: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(value + " " + "is not a valid URL");
        }
      },
    },
    skills: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  //THIS REFERS TO CURRENT INSTANCE OF THE USER SCHEMA
  const token = jwt.sign({ _id: user._id }, "9321550431Angad@", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.verifyPassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

// Create Model for Schema
// const User = mongoose.model("User", userSchema);

// Export the Model
// model.exports = User;

// OR U Can Directly Create Model and Export it
module.exports = mongoose.model("User", userSchema);
