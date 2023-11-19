const Razorpay  = require('razorpay');
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Expense = require("../models/expenseModel");
const Sequelize = require("sequelize");
const sequelize = require("../database");

const premiumpending = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const user = req.user;
    const amount = 2500;


    //creating new payment order in the razorpay using razorpay SDK
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        console.error(err); // Log the error
        return res
          .status(403)
          .json({ message: "Not able to process the payment" });
      }

      Order.create({
        orderId: order.id,
        status: "PENDING",
      })
        .then(() => {
          return res.status(201).json({ order_id:order.id, key_id: rzp.key_id });
        })
        .catch((err) => {
          console.error(err); // Log the error
          return res
            .status(403)
            .json({ message: "Not able to process the payment" });
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Not able to process the payment" });
  }
};

const premiumverification = async (req, res) => {
  let t;
  try {
    const { payment_id, order_id } = req.body;

    if (!payment_id || !order_id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Payment or order details are missing",
        });
    }

    t = await sequelize.transaction();

    const [order, user] = await Promise.all([
      Order.update(
        { paymentId: payment_id, status: "SUCCESSFUL" },
        { where: { orderId: order_id }, transaction: t }
      ),
      User.update(
        { ispremiumuser: true },
        { where: { id: req.user.userId }, transaction: t }
      ),
    ]);

    if (order[0] === 0 || user[0] === 0) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "User or order not found" });
    }
    await t.commit();
    console.log("Order and user updated successfully");
    return res
      .status(202)
      .json({ success: true, message: "Transaction successful" });
  } catch (err) {
    console.error(err);
    if(t){
      await t.rollback();
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { premiumpending, premiumverification };