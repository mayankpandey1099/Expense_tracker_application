const Sequelize = require("sequelize");
const sequelize = require("../database");

const DownloadedFiles = sequelize.define("DownloadedFiles", {
  // Define Expense model attributes here, including userId as a foreign key
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  link: {
    type: Sequelize.STRING,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = DownloadedFiles;
