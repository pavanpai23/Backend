const express = require("express");
const path = require("path");
const UserRoute = require("./routes/user");
const User = require("./modules/user");
const { validateToken } = require("./services/authentication");

const mongoose = require("mongoose");

const app = express();

const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/blogify").then((e) => {
  console.log("mongodb conneceted");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Serve files in public at the site root (for example /images/image.png).
app.use(express.static(path.resolve(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  const cookies = Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .map((part) => part.trim().split(/=(.*)/s).slice(0, 2))
      .filter(([name, value]) => name && value !== undefined)
      .map(([name, value]) => [name, decodeURIComponent(value)]),
  );
  const payload = validateToken(cookies.token);
  if (payload) {
    const user = await User.findById(payload._id).select("fullname profileImageUrl role");
    if (user) {
      // Older records stored this as ./images/image.png, which breaks on nested URLs.
      if (user.profileImageUrl?.startsWith("./")) {
        user.profileImageUrl = `/${user.profileImageUrl.slice(2)}`;
      } else if (user.profileImageUrl && !/^(?:https?:)?\/\//i.test(user.profileImageUrl) && !user.profileImageUrl.startsWith("/")) {
        user.profileImageUrl = `/${user.profileImageUrl}`;
      }
      res.locals.currentUser = user;
    }
  }
  return next();
});

app.use("/user", UserRoute);

app.get("/", (req, res) => {
  return res.render("homePage", { currentUser: res.locals.currentUser });
});

app.listen(PORT, () => console.log("server started at port 8000"));
