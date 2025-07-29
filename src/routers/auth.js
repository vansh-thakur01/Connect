const express = require("express");
const authRouter = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt")
const {signupValidation} = require("../utils/signupValidations");
const jwt = require("jsonwebtoken");


authRouter.post("/signup", async (req, res) => {
  try {
    console.log(req.body,"sdfad")
    signupValidation(req.body);

    let { password, lastName, firstName, email ,url, about,age} = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      url,
      about,
      age
    });
    const data = await user.save();
    res.json({
      message:"User created successfully",
      data
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.find({ email: email });
    if (!user) throw new Error("Invalid crediantials");
    let [userData] = user;
    
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (isPasswordValid) {
      const token = userData.getJwt();
      console.log(token);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 5 * 36000000),
      });
    } else throw new Error("Invlid crediantials");

    res.json({
      message:"Loggedin successfully",
      data:userData
    });

    } catch (err) {
    res.status(400).json({message: "Invalid Credentals"});
  }
});

authRouter.post("/logout",(req,res)=>{
  try{
    res.cookie("token",null,{expires:new Date(Date.now())})
    res.json({
      message:"Logout successfully"
    })
  }
  catch(err){
    res.status(400).json({
      message:"Token is not present"
    })
  }
})

module.exports = authRouter;