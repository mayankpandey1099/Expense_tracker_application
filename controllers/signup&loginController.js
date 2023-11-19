const User = require("../models/userModel");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "nodemon.json" });
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");



// signup function for the user to sign in

const processSignUp = async (req, res) => {
  const { name, email, password, isPremium } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "missing required fields",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      ispremiumuser: isPremium,
    });
  
    const token = jwt.sign({ userId: newUser.id }, process.env.jwtSecret);
    const subject = "Registration Successful";
    const text = "Thank you for registering. Your registration was successful.";
    await sendSuccessEmail(email,subject,text);
    res.status(201).json({
      message:
        "registration successful. Check your email for a confirmation message",
      token: token,
      isPremium,
    });
  } catch (err) {
    console.log("error during sign-up");
    res.status(500).json({
      error: "an error occurred while registering the user",
    });
  }
};


//login function for the user to login

const processLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ userId: user.id }, process.env.jwtSecret);
    const isPremium = user.ispremiumuser;

    if (passwordMatch) {
      console.log("password match");
      //Passwords match, so the user is authenticated
      const subject = "Login Successful";
      const text = "Thank you for logging in. Your login was successful.";
      await sendSuccessEmail(email,subject,text);
      res.status(200).json({ message: "login successfully", token , isPremium});
    } else {
      console.log("password not match");
      // Passwords don't match
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the login" });
  }
};


// sending successful registration/login email on the user's id

async function sendSuccessEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Your email service provider
    auth: {
      user: process.env.EMAIL_ID, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to,
    subject,
    text,
  }
  try {
    await transporter.sendMail(mailOptions);
    console.log("Success email sent");
  } catch (error) {
    console.error("Error sending success email:", error);
  }
};

module.exports = {
  processSignUp,
  processLogin,
};

