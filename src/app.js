const express = require("express");
const { connectDb } = require("./config/database");
const cookiesParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookiesParser());

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/proflie");
const requestRouter = require("./routers/request");
const userRouther = require("./routers/user")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouther);


app.use((err, req, res, next) => {
  res.send("last line of error defence reached: " + err.message);
});

connectDb()
  .then(() => {
    console.log("Connected to db");
    app.listen(9000, () => {
      console.log("server is running on 9000 port");
    });
  })
  .catch((err) => {
    console.log("error occurred", err.message);
  });
