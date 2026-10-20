const express = require("express");
const path = require("path");
const UserRoute = require("./routes/user");
const blogroute = require("./routes/blog");
const cookieparser = require("cookie-parser");

const Blog = require("./modules/blog");

const mongoose = require("mongoose");
const { checkForAuthenticateCookie } = require("./middlewares/authentication");

const app = express();

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/blogify")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
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

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
