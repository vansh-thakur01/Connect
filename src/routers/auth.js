const express = require("express");
const authRouter = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt")
const {signupValidation} = require("../utils/signupValidations");
const jwt = require("jsonwebtoken");


authRouter.post("/signup", async (req, res) => {
  try {
    signupValidation(req.body);

    let { password, lastName, firstName, email } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const data = await user.save();
    res.send("user saved");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.get("/login", async (req, res) => {
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
      res.send("login successful");
    } else throw new Error("Invlid crediantials");
  } catch (err) {
    res.status(404).send("something went wrong: " + err.message);
  }
});

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())})
    res.send("Logout successful")
})

module.exports = authRouter;