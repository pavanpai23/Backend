const express = require("express");
const path = require("path");
const UserRoute = require("./routes/user");

const mongoose = require("mongoose");

const app = express();

const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/blogify").then((e) => {
  console.log("mongodb conneceted");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

app.use("/user", UserRoute);

app.get("/", (req, res) => {
  return res.render("homePage");
});

app.listen(PORT, () => console.log("server started at port 8000"));
