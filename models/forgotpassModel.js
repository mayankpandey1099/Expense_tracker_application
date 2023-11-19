const Sequelize = require("sequelize");
const sequelize = require("../database");
const uuid = require("uuid");

const forgotPasswordRequest = sequelize.define("forgotPasswordRequest", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: uuid.v4(),
  },
  isactive: { 
    type: Sequelize.BOOLEAN, 
    defaultValue: true 
  },
});

module.exports = forgotPasswordRequest;
