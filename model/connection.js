const mongoose = require("mongoose");
const connecion = async (url) => {
  try {
    await mongoose.connect(url, {});
    console.log("Database connection");
  } catch (err) {
    console.log("db dissconnect");
  }
};

module.exports = connecion;
