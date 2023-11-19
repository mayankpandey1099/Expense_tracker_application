const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const sequelize = require("../database");
const { Op } = require("sequelize");



const getUserLeaderBoard = async (req, res) => {
    try{
    const users = await User.findAll({
      attributes: ["id", "name", "total_cost"],
      order: [["total_cost", "DESC"]],
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const daily = async (req, res) => {
    try{
        const today = new Date();
        const startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);

        const expenses = await Expense.findAll({
            where: {
                UserId: req.user.userId,
                updatedAt: {
                    [Op.between]: [startDate, endDate]
                },
            },
            orders: [["total_cost", "DESC"]],
        });

        res.json(expenses);
    }catch(err) {
        console.log(err);
        res.status(500).json({error: "internal server errror"});
    }
}

const monthly = async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

    const endDate = new Date( today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const expenses = await Expense.findAll({
      where: {
        UserId: req.user.userId,
        updatedAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      orders: [["total_cost", "DESC"]],
    });

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const yearly = async (req, res) => {
    try{
        const today = new Date();
        const startDate = new Date(today.getFullYear(), 0 , 1);
        const endDate = new Date(today.getFullYear(), 11,31, 23, 59, 59, 999);

        const expenses = await Expense.findAll({
            where: {
                UserId: req.user.userId,
            updatedAt: {
                [Op.between]: [startDate, endDate]
            },           
        },
        orders: [["total_cost", "DESC"]],
    });

    res.json(expenses);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
}

module.exports = {getUserLeaderBoard, daily, monthly, yearly};
