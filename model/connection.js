const mongoose = require("mongoose");
const connecion = async (url) => {
  try {
    const connection = await mongoose.connect(url, {});
    console.log("Database connection");
  } catch (err) {
    console.log("db dissconnect");
  }
};

module.exports = connecion;
