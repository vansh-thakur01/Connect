const express = require("express");
const {connectDb} = require("../config/database");
const User = require("../config/models/users");

const app = express();

app.use(express.json());

app.post("/signup", async (req,res)=>{

    const user = new User(req.body)
    try{
        user.save();
        res.send("user saved");
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

app.get("/user", async (req,res)=>{
    let name = req.body.firstName;

    try{
        let user = await User.findOne({firstName:name});
        res.send(user);
    }catch(err){
        res.send("somnethig went wrong");
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

connectDb().then(()=>{
    console.log("Connected to db");
    app.listen(9000,()=>{
        console.log("server is running on 9000 port");
    })
}).catch((err)=>{
    console.log("error occurred",err.message);
})