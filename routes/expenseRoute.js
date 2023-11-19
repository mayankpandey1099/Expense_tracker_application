const express = require("express");
const router = express.Router();
const path = require("path");

const {
  createExpense,
  getAllPaginatedExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getfilehistory,
  downloadExpense,
} = require("../controllers/expenseController");


router.post("/", createExpense);
router.get("/paginated", getAllPaginatedExpenses);
router.get("/download", downloadExpense);
router.get("/filehistory", getfilehistory);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);


module.exports = router;