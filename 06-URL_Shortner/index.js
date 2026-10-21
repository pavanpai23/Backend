const express = require("express");
const mongoose = require("mongoose");
const urlRoute = require("./routers/url");
const path = require("path");
const app = express();
const URL = require("./models/url");
const { ConnectMongoDb } = require("./connection");
const staticRouter = require("./routers/staticRouter");
const PORT = 8001;

ConnectMongoDb("mongodb://127.0.0.1:27017/url-shortner").then(() => {
  console.log("MongoDb connected");
});

//server side rendering
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRouter);

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
