const List = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../database");
const DownloadedFiles = require("../models/downloadfileModel");
const UserServices  = require("../service/userservices");
const S3Services = require("../service/S3services");



  const getAllPaginatedExpenses = async (req, res) => {
    try {
      const userId = req.user.userId;
      const page = req.query.page || 1; // Get the requested page from query parameters
      const pageSize = 5; // Set the page size

      const { count, rows } = await List.findAndCountAll({
        where: { userId: userId },
        attributes: ["id", "name", "quantity", "amount"],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      const totalPages = Math.ceil(count / pageSize);

      res.json({
        totalItems: count,
        totalPages: totalPages,
        currentPage: page,
        expenses: rows,
      });
    } catch (error) {
      console.error("Error fetching paginated expenses:", error);
      res.status(500).json({
        error: "An error occurred while fetching paginated expenses.",
      });
    }
  };
  const getExpenseById =  async (req, res) => {
    const expenseId = req.params.id;
    try {
      const row = await List.findOne({ where: {id: expenseId}});
      if (!row) {
        return res.status(404).json({ error: "Expense not found" });
      }
    res.json(row);
    } catch (error) {
        console.error("error fetching expense", error);
      res.status(500).json({
        error: "An error occurred while fetching a user.",
      });
    }
  };

  const createExpense = async (req, res) => {
    let t;
    try {
      const { name, quantity, amount } = req.body;
      const user = req.user;

      t = await sequelize.transaction();
    
      const newExpense = await List.create({
        name,
        quantity,
        amount,
        userId: req.user.userId,
      },
      { transaction: t }
      );

      await User.update(
        {total_cost: sequelize.literal(`total_cost + ${amount}`),
      },
      {
        where: {id: user.userId},
        transaction: t,
      }
      );
      await t.commit();

      res.status(201).json(newExpense);
    } catch (error) {
      if(t){
        await t.rollback();
      }
      console.error("Error creating expense:", error);
      res.status(500).json({
        error: "An error occurred while inserting the user.",
      });
    }
  };

  const deleteExpense = async (req, res) => {
    let t;
    const expenseId = req.params.id;
    try {
      t = await sequelize.transaction();

      const rowsAffected = await List.findOne({
        where: { id: expenseId},
        attribute: ["id", "amount"],
        transaction: t,
      });
      if(!rowsAffected){
        await t.rollback();
        return res.status(404).json({
          error: "Expense not found",
        });
      }
       
      const amountToDelete = rowsAffected.amount;
      await User.update(
        {
          total_cost: sequelize.literal(`total_cost - ${amountToDelete}`),
        },{
          where: {id: req.user.userId},
          transaction: t,
        }
      );

      await List.destroy(
        {
          where: {id: expenseId},
          transaction: t,
        }
      );

      await t.commit();

      res.json({
        message: "Expense deleted successfully",
      });
    } catch (error) {
      if(t){
        await t.rollback();
      }
      console.error("error deleting expense:",error);
      res.status(500).json({
        error: "An error occurred while deleting the user.",
      });
    }
  };


  const updateExpense = async (req, res) => {
    let t;
    const expenseId = req.params.id;
    const { name, quantity, amount } = req.body;
    const user = req.user;

    try {
      const userId = req.user.userId;
      t = await sequelize.transaction();

      const row = await List.update(
        {
          name,
          quantity,
          amount,
        },
        {
          where: { id: expenseId, userId: userId},
          returning: true,
          transaction: t,
        }
      );

      const updatedExpense = await List.findByPk(expenseId);

      if(row === 0){
        await t.rollback();
        return res.status(404).json({
          error: "Expense not found",
        });
      }
      
      const diffAmount = amount - updatedExpense.amount;

      await User.update(
        {
          total_cost: sequelize.literal(`total_cost + ${diffAmount}`),
        },
        {
          where: { id: userId},
          transaction: t,
        }
      );

      await t.commit();

     
      res.json(updatedExpense);
    } catch (error) {
      if(t){
        await t.rollback();
      }
      console.error("error updating expense:",error);
      res.status(500).json({
        error: "An error occurred while updating the user.",
      });
    }
  };


const downloadExpense = async (req, res) => {
    try {
      const userId = req.user.userId;
      let Expense = await List.findAll({where: { userId: userId }, });
      const stringifiedExpenses = JSON.stringify(Expense);
      const filename = `Expenses${userId}/${new Date()}.txt`;
      const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
      console.log("this is the fileUrl",fileURL);
      const downloadfiles = await DownloadedFiles.create({
        link: fileURL,
        userId: userId,
      });
      res.status(200).json({ fileURL, success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong", err: err });
    }
};

const getfilehistory = async (req, res) => {
    try {
      let userId = req.user.userId;
      let files = await DownloadedFiles.findAll({ where: { userId: userId } });
      console.log(files);
      res.json(files);
    } catch (err) {
      res
        .status(500)
        .json({ message: "can't find the require files", err: err });
    }
};
 

module.exports = {createExpense,getAllPaginatedExpenses, getExpenseById, updateExpense, deleteExpense, getfilehistory, downloadExpense};
