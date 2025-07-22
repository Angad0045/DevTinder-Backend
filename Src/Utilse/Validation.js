const validator = require("validator");

const validateLoginData = (req) => {
  const { firstName, lastName, emailId, password } = req?.body;

  if (!firstName || !lastName) {
    throw new Error("Enter a valid Firstname or Lastname");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  //GETTING DATA FOR VALIDATION
  const { firstName, lastName, photoUrl, age, gender, about, skills } =
    req?.body;
  //CREATING A LIST OF DATA THAT CAN BE EDITED
  const editableFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "skills",
    "about",
  ];
  //CHECKING IF THE RECEIVED DATA CAN BE EDITED OR NOT
  const isFieldEditable = Object.keys(req?.body).every((field) =>
    editableFields.includes(field)
  );

  if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Enter a valid URL");
  }
  return isFieldEditable;
};

module.exports = {
  validateLoginData,
  validateEditProfileData,
};
