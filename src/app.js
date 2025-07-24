const express = require("express");
const bcrypt = require("bcrypt");
const {connectDb} = require("../config/database");
const User = require("../config/models/users");
const signupValidation = require("./utils/signupValidations")
const cookiesParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth = require("./middleware/userAuth");

const app = express();

app.use(express.json());
app.use(cookiesParser());


app.post("/signup", async (req,res)=>{
    try{
        signupValidation(req.body);

        let {password, lastName, firstName, email} = req.body;

        const passwordHash = await bcrypt.hash(password,10);
        const user = new User({firstName, lastName, email, password:passwordHash})
        const data = await user.save();
        res.send("user saved");
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

app.get("/login",async (req,res)=>{
    try{
        let {email,password} = req.body;
        let user = await User.find({email:email});
        if(!user) throw new Error("Invalid crediantials");
        let [userData] = user
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if(isPasswordValid){
            const token = jwt.sign({_id:userData._id,firstName:userData.firstName},"Shama@InLife", {expiresIn:"1d"});
            res.cookie("token",token,{expires:new Date(Date.now() + 5 * 36000000)});
            res.send("login successful")
        } 
        else throw new Error("Invlid crediantials");

    }catch(err){
        res.status(404).send("something went wrong: "+err.message);
    }
})

app.get("/user",userAuth, async (req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.send("somnethig went wrong : "+ err.message);
    }
})

app.get("/feed",async(req,res)=>{
    let name = req.body.firstName;
    try{
        let users = await User.find({firstName:name});
        if(!users.length) res.status(404).send("user not found");
        res.send(users);
    }
    catch(err){
        res.send("something not working")
    }
})

app.delete("/user",async (req,res)=>{
    console.log("deleting")
    let userId = req.body.userId;
    console.log(userId)
    try{
        let user = await User.findByIdAndDelete(userId);
        console.log(user);
        res.send("user deleted successfully");
    }
    catch(err){
        res.send("something went wrong in delete method")
    }
    
})
app.patch("/user/:userID",async (req,res)=>{
    try{
        console.log("updating")
        let id = req.params.userID
        let change= req.body;
        const UPDATE_ALLOWED = ["lastName","age"];
        const isOkToUpdate = Object.keys(req.body).every((k)=>UPDATE_ALLOWED.includes(k));
        
        if(!isOkToUpdate) throw new Error("Not a valid update");

        let user = await User.findOneAndUpdate({_id:id},{lastName:change.lastName},{runValidators:true});
        res.send("user updated successfully");
    }
    catch(err){
        res.status(400).send("patching went wrong: "+err.message)
    }
    
})

app.use((err,req,res,next)=>{
    res.send("last line of error defence reached: " + err.message);
})

connectDb().then(()=>{
    console.log("Connected to db");
    app.listen(9000,()=>{
        console.log("server is running on 9000 port");
    })
}).catch((err)=>{
    console.log("error occurred",err.message);
})