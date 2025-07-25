const express = require("express");
const profileRouter = express.Router();
const {validateEditProfileData}  = require("../utils/signupValidations");
const bcrypt = require("bcrypt");

const userAuth = require("../middleware/userAuth");

profileRouter.get("/profile", userAuth, async (req, res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error:" + err.message);
    }
});
profileRouter.patch("/profile/edit/password", userAuth, async (req,res)=>{
    try{
        let newPassword = req.body.newPassword;
        let encrypt = await bcrypt.hash(newPassword,10);
        req.user.password = encrypt;
        await req.user.save();
        res.send("password updated successfuly");        
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.patch("/profile/edit",userAuth,async (req, res)=>{
    try{
        if(!validateEditProfileData(req)) throw new Error("Invalid Edit Request");

        let user = req.user;
        Object.keys(req.body).forEach((key)=> user[key] = req.body[key]);

        await user.save();

        res.json({
            message:`${user.firstName}, your profile update successfuly`,
            data:user,
        });
    }catch(err){
        res.send("Error: " + err.message)
    }
})


module.exports = profileRouter;
