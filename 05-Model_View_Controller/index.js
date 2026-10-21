const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 8000;

const { logReqRes } = require("./middlewares");
const userRouter = require("./routes/user.js");
const { connectMongoDB } = require("./connection.js");

//connection
connectMongoDB("mongodb://127.0.0.1:27017/Youtube-app-1").then(() =>
  console.log("mongoDb connected"),
);

//schema

//middle ware is used because it helps to put form data inside a body also known as plugins
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("Hello from middleware 1");
  next();
});

app.use((req, res, next) => {
  console.log("hello from middleware 2");
  next();
});

app.use(logReqRes("log.txt"));

//routes
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`Server Stared at port: ${PORT}`));
