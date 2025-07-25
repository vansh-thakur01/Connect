const jwt = require("jsonwebtoken");
const User = require("../models/users");

const userAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) throw new Error("not valid token");

    let decoded = jwt.verify(token, "Shama@InLife");
    let user = await User.findOne({ _id: decoded._id });
    if (!user) throw new Error("user is not valid");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = userAuth;
