const Sequelize = require("sequelize");
const sequelize = require("../database");

const Order = sequelize.define("Order", {
    paymentId:{
        type: Sequelize.STRING,   
    },
    orderId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    
});

module.exports = Order;