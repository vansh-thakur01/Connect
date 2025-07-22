const express = require("express");

const app = express();
console.log(app.toString());
app.use("/test",(req,res)=>{
    res.send("hellow")
})

app.listen(9000,()=>{
    console.log("server is running on 9000 port");
});