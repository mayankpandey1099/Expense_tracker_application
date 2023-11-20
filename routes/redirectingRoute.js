const express = require("express");
const router = express.Router();
const path = require("path");


router.get("/welcome", (req, res) => {
  const filePath = path.join(__dirname,"..", "public", "welcome", "Welcome.html");
  res.sendFile(filePath);
});

router.get("/login", (req, res) => {
  const filePath = path.join(__dirname, "..", "public", "login", "login.html");
  res.sendFile(filePath);
});
router.get("/signup", (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "signup",
    "signup.html"
  );
  res.sendFile(filePath);
});

router.get("/forgot", (req, res) => {
  const filePath = path.join(__dirname, "..", "public", "login", "forgotpass.html");
  res.sendFile(filePath);
});
router.get("/reset",(req, res) => {
  const uuid = req.query.uuid;
  const filePath = path.join(__dirname, "..", "public", "resetpassword", "resetpassword.html");
  res.sendFile(filePath , { query: { uuid }});
});

router.get("/list", (req, res) => {
  const filePath = path.join( __dirname, "..", "public", "expensetracker", "expenseTracker.html");
  res.sendFile(filePath);
});

router.get("/report", (req,res)=>{
  const filePath = path.join(__dirname, "..", "public", "report", "report.html");
  res.sendFile(filePath);
})

module.exports = router;
