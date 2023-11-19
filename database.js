
const Sequelize = require("sequelize");
const mysql = require("mysql2");


//connecting to the database using the sequelize ORM(OBJECT RELATIONAL MAPPING)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false
})

module.exports = sequelize;
// Load environment variables

