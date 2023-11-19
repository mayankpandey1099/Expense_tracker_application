require("dotenv").config();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
// Make sure this matches the key you used to sign the token

const verify = async (req, res, next) => {
  try{
    const token  = req.header('Authorization');
    const key = process.env.jwtSecret;

    const tokenWithoutBearer = token.replace("Bearer ", "");
    const user = jwt.verify(tokenWithoutBearer, key);

    User.findOne({where: {id: user.userId}}).then(foundUser => {
      if(foundUser){
      req.user = user;
      next();
      }else{
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }
    }).catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({
          success: false,
          message: "An error occurred while fetching the user",
        });
    })
  }catch(error){
    console.log(error);
    return res
      .status(401)
      .json({ success: false, message: "Token verification failed" });
  }
};

module.exports = {verify};