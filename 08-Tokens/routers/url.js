const express = require("express");

const {
  handlerGenerateShortUrl,
  handlerGetAnalytics,
} = require("../controllers/url");
const router = express.Router();

router.post("/", handlerGenerateShortUrl);

router.get("/analytics/:shortId", handlerGetAnalytics);

module.exports = router;
