require("dotenv").config({ path: "nodemon.json" });
var SibApiV3Sdk = require("sib-api-v3-sdk");
const forgotPasswordRequest = require("../models/forgotpassModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const sequelize = require("../database");

const apiKey = process.env.ForgotPassKey;


const forgotpasswordData = async (req, res, next) => {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const email = req.body.email;

    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const forpasswordrequest = await forgotPasswordRequest.create({
        userId: user.id,
        isactive: true,
      });

      console.log("this is users id",user.id);

      console.log("this is forpasswordrequest userId", forpasswordrequest.userId);

      console.log("this is forpasswordrequest id", forpasswordrequest.id);

      const apiKeyInstance = defaultClient.authentications["api-key"];
      apiKeyInstance.apiKey = apiKey;
      const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      // Configure the email
      sendSmtpEmail.to = [{ email: email }];
      sendSmtpEmail.sender = { email: "rampandeylko@gmail.com", name: "Mayank Pandey" };
      sendSmtpEmail.subject = "Password Recovery";
      sendSmtpEmail.htmlContent = `<a href="http://localhost:3000/api/pass/resetpassword/${forpasswordrequest.id} "> click here to reset password</a>`; // Replace with your email content

      // Send the email
      await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);

      console.log("Recovery email sent successfully");
      res.status(200).json({ message: "Recovery email sent successfully" });
    } else {
      // Handle the case when the user with the provided email does not exist.
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(
      "Error sending recovery email:",
      err.response ? err.response.text : err.message
    );
    res.status(500).json({ message: "Error sending recovery email" });
  }
};

const resetpassword = async (req, res, next) => {
  try {
    const forPasswordRequest = await forgotPasswordRequest.findOne({
      where: { id: req.params.uuid },
    });

    if (!forPasswordRequest || !forPasswordRequest.isactive) {
      return res.status(401).json({ message: "Invalid reset link" });
    }
    const userId = forPasswordRequest.userId;
    console.log("this is the forpassword userId in resetpassword ",userId);
    // Redirect the user to the password reset form with the UUID as a query parameter
    console.log("this is req params uuid in restpassword ", req.params.uuid);
    res.redirect(
      `http://127.0.0.1:3000/api/redirecting/reset?uuid=${req.params.uuid}`
    );
  } catch (err) {
    console.error("Error in resetpassword route:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const newpassword = async (req, res, next) => {
  let t;
  try {
    const password = req.body.password;
    const uuid = req.body.uuid;

    console.log("this is newpassword uuid",uuid);

    const forpasswordrequest = await forgotPasswordRequest.findOne({
      where: { id: uuid, isactive: true },
    });

    if (!forpasswordrequest) {
      return res.status(401).json({ message: "Invalid reset link" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = forpasswordrequest.userId;
    t = await sequelize.transaction();
    const updatedUser = await User.update(
      { password: hashedPassword },
      { where: { id: userId } },
      { transaction: t }
    );

    // Set isactive to false after the link is used
    await forpasswordrequest.update({ isactive: false }, { transaction: t });

    t.commit();
    console.log(updatedUser);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    if (t) {
      t.rollback();
    }
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {forgotpasswordData, resetpassword, newpassword};