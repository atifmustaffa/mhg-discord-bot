// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

const http = require('http');
const bot = require('./bots.js');
const wa = require('./views/watchasian/watchasian.js');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  // response.sendFile(__dirname + '/views/index.html');

  console.log(new Date().toUTCString() + " Ping Received");
  response.sendStatus(200);
});

app.get('/watchasian/', function (request, response) {
  //wa.load()
  
  // response.sendFile(__dirname + '/views/watchasian/watchasian.js');
  //response.sendFile(__dirname + '/views/watchasian/data.json');
});

app.get('/watchasian/', function (request, response) {
  //wa.load()
  
  console.log(request.query)
  //response.sendFile(__dirname + '/views/watchasian/data.json');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


// Code to keep the web alive, pinging itself
// Not working - >>>> using UptimeRobot
//setInterval(() => {
//  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
// }, 280000);

  // startBot
  bot.startBot();