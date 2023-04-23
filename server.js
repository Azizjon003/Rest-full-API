const dotenv = require("dotenv");
dotenv.config();
console.log("salom");
const logger = require("./utility/logger");
process.on("uncaughtException", (err) => {
  console.log(err.message);
  logger.error(`Name ${err.name}   Message : ${err.message}`);
});
const app = require("./middlewares/app");

const connection = require("./model/connection");
require("./redis/connection");

const port = process.env.PORT || 8000;
let dbUrl = process.env.DB;

const dbPass = process.env.DB_PASS;
dbUrl = dbUrl.replace("<password>", dbPass);

connection(dbUrl);

let server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  logger.debug(`Server is listening on port ${port}`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.message);
  logger.error(`Name ${err.name}   Message : ${err.message}`);
});
// console.log(server);

module.exports = server;
