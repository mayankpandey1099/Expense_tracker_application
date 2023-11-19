const express = require("express");
const router = express.Router();
const { processSignUp, processLogin } = require("../controllers/signup&loginController");


router.post("/signupUser",processSignUp);
router.post("/loginUser", processLogin);

module.exports = router;