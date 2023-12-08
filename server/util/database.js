const Sequilize = require("sequelize");
require("dotenv").config();

const { CONNECTION_STRING } = process.env;

const sequelize = new Sequilize(CONNECTION_STRING, {
  dialect: "postgres",
});

module.exports = { sequelize };
