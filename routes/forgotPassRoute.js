const express = require("express");
const router = express.Router();
const {
  forgotpasswordData,
  resetpassword,
  newpassword,
} = require("../controllers/forgotpassController");

router.post("/forgotpassword", forgotpasswordData);
router.get("/resetpassword/:uuid", resetpassword);
router.post("/newpassword", newpassword);

module.exports = router;
