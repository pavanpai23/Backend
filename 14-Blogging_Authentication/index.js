const express = require("express");
const path = require("path");
const UserRoute = require("./routes/user");
const blogroute = require("./routes/blog");
const cookieparser = require("cookie-parser");

const Blog = require("./modules/blog");

const mongoose = require("mongoose");
const { checkForAuthenticateCookie } = require("./middlewares/authentication");

const app = express();

const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/blogify").then((e) => {
  console.log("mongodb conneceted");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("./public")));

app.use(cookieparser());
app.use(checkForAuthenticateCookie("token"));

app.use("/user", UserRoute);
app.use("/blog", blogroute);

app.get("/", async (req, res) => {
  const allblogs = await Blog.find({});
  return res.render("homePage", {
    user: req.user,
    blogs: allblogs,
  });
});

app.listen(PORT, () => console.log("server started at port 8000"));
