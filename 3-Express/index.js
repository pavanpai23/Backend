const http = require("http");
const fs = require("fs");
const url = require("url");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("hello from Home Page");
});

app.get("/about", (req, res) => {
  res.send("Hello from About page");
});

const myserver = http.createServer(app);

function myHandler() {
  if (req.url === "/favicon.ico") return res.end();
  const log = `${Date.now()}: ${req.method} ${req.url} New Request Recived\n`;
  const myUrl = url.parse(req.url, true);
  fs.appendFile("log.txt", log, (err, data) => {
    switch (myUrl.pathname) {
      case "/":
        if (res.method === "GET") res.end("home page");
        console.log("Home Page");
        break;
      case "/about":
        const username = myUrl.query.myname;
        res.end(`hi ${username}`);
        break;
      case "/search":
        const search = myUrl.query.search_query;
        res.end("here is your result for" + search);
        break;
      case "/signup":
        if (req.method === "GET") res.end("this is a sigh up page");
        else if (req.method === "POST") {
          //DB query
          res.end("success");
        }
      default:
        res.end("404 not found");
    }
  });

  console.log("New Req Recorded");
  res.end();
}

myserver.listen(8000, () => console.log("server started"));
