const mongoose = require("mongoose");


const connectDb = async ()=>{
    try{
        await mongoose.connect("mongodb+srv://vansh:eDEYUar6YortNu2j@cluster1.cmrkiim.mongodb.net/connection");
    }catch(err){
        throw err;
    }
}

module.exports = {
    connectDb,
}