const express = require("express");
const path = require("path");
const zlib = require("zlib");
const fs = require("fs");
const { pipeline } = require("stream");

const app = express();
const PORT = process.env.PORT || 8000;
const samplePath = path.join(__dirname, "sample.txt");
const compressedPath = path.join(__dirname, "sample.txt.gz");

pipeline(  fs.createReadStream(samplePath),
  zlib.createGzip(),
  fs.createWriteStream(compressedPath),
  (error) => {
    if (error) {
      console.error("Could not compress sample.txt:", error.message);
      return;
    }
    console.log("Compressed sample.txt to sample.txt.gz");
  },
);

app.get("/", (req, res, next) => {
  res.type("text/plain");
  const stream = fs.createReadStream(samplePath, { encoding: "utf8" });
  stream.on("error", next);
  stream.pipe(res);
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
