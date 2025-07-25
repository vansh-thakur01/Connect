const validator = require("validator");
const signupValidation = (req)=>{
    const {lastName, firstName, email, password} = req;
    if(!firstName || !lastName) throw new Error("name is not valid");
    if(!validator.isEmail(email)) throw new Error("Email is not valid");
    if(!validator.isStrongPassword(password) ) throw new Error("password is not strong");

}

const validateEditProfileData = (req)=>{
    const allowedEditFields = ["firstName","lastName"];
    const valid = Object.keys(req.body).every((field)=> allowedEditFields.includes(field));
    
    return valid
}

module.exports = {signupValidation,validateEditProfileData};