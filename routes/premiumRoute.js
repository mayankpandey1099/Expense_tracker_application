const express = require("express");
const {premiumpending , premiumverification} = require("../controllers/premiumuserController");
const {getUserLeaderBoard, daily, monthly, yearly} = require("../controllers/leaderboardController");

const router = express.Router();

router.get("/takepremium", premiumpending);
router.post("/updatetransactionstatus", premiumverification);
router.get("/leaderboard", getUserLeaderBoard);
router.get("/daily", daily);
router.get("/monthly", monthly);
router.get("/yearly", yearly);

module.exports = router;

