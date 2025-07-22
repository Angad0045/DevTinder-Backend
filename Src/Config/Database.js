const moongoose = require("mongoose");

const connectDB = async () => {
  moongoose.connect(
    "mongodb+srv://Angad1141:RealMadrid9930$@utd1141.j4n6n.mongodb.net/DevTinder"
  );
};

module.exports = connectDB;
