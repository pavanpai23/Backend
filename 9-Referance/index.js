const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");

const { restrictToLogedInUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");
const { ConnectMongoDb } = require("./connection");
const PORT = 8001;

ConnectMongoDb("mongodb://127.0.0.1:27017/url-shortner").then(() => {
  console.log("MongoDb connected");
});

const urlRoute = require("./routers/url");
const staticRouter = require("./routers/staticRouter");
const userRoute = require("./routers/user");

//server side rendering
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLogedInUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/",checkAuth, staticRouter);

app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
  });
});

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
  );
  res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`Server Started at port`, PORT));
