const YAML = require("yamljs");
const swaggerUI = require("swagger-ui-express");
const path = require("path");

const swaggerDocument = YAML.load(path.join(__dirname, "../doc/api.yaml"));

module.exports = {
  swaggerUI,
  swaggerDocument,
};
