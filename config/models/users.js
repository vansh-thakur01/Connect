const validator = require("validator")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true,
        minLength:1,
        maxLength:100
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        validate(email){
            if (!validator.isEmail(email)) throw new Error("Not a valid email");
        }
    },
    password:{
        type:String,
        require:true,
        minLength:6,
        maxLength:100,
        validate: {
            validator: function(v) {
                if(!v.includes("5")) throw new Error("Not a strong password");
        }}
    },
    age:{
        type:Number
    },
},{timestamps:true})

userSchema.methods.getJwt = function(){
    let user = this;
    const token = jwt.sign({_id:user._id,firstName:user.firstName},"Shama@InLife", {expiresIn:"1d"});
    return token; 
}

module.exports = mongoose.model("User",userSchema);