const dotenv = require("dotenv");
dotenv.config();
const app = require("./middlewares/app");
const connection = require("./model/connection");

const port = process.env.PORT || 8000;
let dbUrl = process.env.DB;
const dbPass = process.env.DB_PASS;
dbUrl = dbUrl.replace("<password>", dbPass);
connection(dbUrl);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
