// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();

const http = require("http");
const bot = require("./bots.js");
const scraper = require("./potusScraper.js");

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  // response.sendFile(__dirname + '/views/index.html');

  console.log(new Date().toUTCString() + " Ping Received");
  response.sendStatus(200);
});

app.get("/watchasian", function(request, response) {
  if (request.query.param) {
    require("./views/watchasian/watchasian.js").load(request.query.param);
    response.sendStatus(200);
  } else {
    response.setHeader("Access-Control-Allow-Origin", "https://watchasian.to");
    response.sendFile(__dirname + "/views/watchasian/data.json");
  }
});

app.get("/dota-procircuit/:type", function(request, response) {
  switch (request.params.type) {
    case "league":
      scraper.getLeagues().then(function(data) {
        response.status(200).send(data);
      });
      break;
    case "live-tournament":
      scraper.liveTournament().then(function(data) {
        response.status(200).send(data);
      });
      break;
    default:
      response.status(404).send("Not found");
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

// Code to keep the web alive, pinging itself
// Not working - >>>> using UptimeRobot
//setInterval(() => {
//  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
// }, 280000);

// startBot
// bot.startBot();
