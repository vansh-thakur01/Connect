const express = require("express");

const app = express();
// console.log(app.toString());

app.use((req,res,next)=>{
    next( new Error("errrrroooooooooooor"));
})

app.use("/admin",(req,res,next)=>{
    console.log("admin auth")
    let name = "o";
    if(name === "o") next();
    else res.status(401).send("no access"); 
    // res.send("hi");
})

app.get("/admin/getdata",(req,res)=>{
    res.send("gettingData");
})

app.get("/admin/deletedata",(req,res)=>{
    res.send("deleting data");
})

app.use((err,req,res,next)=>{
    res.status(500).send("error");
})

app.listen(9000,()=>{
    console.log("server is running on 9000 port");
});