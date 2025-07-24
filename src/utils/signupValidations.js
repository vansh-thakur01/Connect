const validator = require("validator");
const signupValidation = (req)=>{
    const {lastName, firstName, email, password} = req;
    if(!firstName || !lastName) throw new Error("name is not valid");
    if(!validator.isEmail(email)) throw new Error("Email is not valid");
    if(!validator.isStrongPassword(password) ) throw new Error("password is not strong");

}

module.exports = signupValidation;