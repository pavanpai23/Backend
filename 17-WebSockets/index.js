const express = require("express");
const path = require("path");

const app = express();
const server = http.createServer(app);

app.use(express.static(path.resolve("./public")));

app.get("/", (Req, res) => {
  res.sendFile("");
});

server.listen(9000, console.log("server started at port 9000"));
