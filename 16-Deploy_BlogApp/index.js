require("dotenv").config();

const express = require("express");
const path = require("path");
const UserRoute = require("./routes/user");
const blogroute = require("./routes/blog");
const cookieparser = require("cookie-parser");

const Blog = require("./modules/blog");

const mongoose = require("mongoose");
const { checkForAuthenticateCookie, validateRequestOrigin } = require("./middlewares/authentication");

const app = express();
app.disable("x-powered-by");
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("Set JWT_SECRET to at least 32 characters before starting the app.");
}

const PORT = Number(process.env.PORT) || 8000;
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI must be configured");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(validateRequestOrigin);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});
app.use(express.static(path.join(__dirname, "public"), { dotfiles: "deny", index: false }));

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

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send("Something went wrong.");
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`Server started on port ${PORT}`)))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
