const Sequelize = require("sequelize");
const sequelize = require("../database");

const user = sequelize.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ispremiumuser: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  total_cost: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = user;