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

app.set('view engine', 'ejs');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  // response.sendFile(__dirname + '/views/index.html');
  console.log(new Date().toUTCString() + " Ping Received");
  response.status(200).render('home', { config: require('./config.json'), commands: require('./commands.json') });

  // Check for live valve match then update bot activity status
  if (bot.isReady()) {

    // if (bot.getActivityString().toLowerCase() === 'watching dota 2 twitch stream')
    scraper
      .liveMatches()
      .then(function (data) {
        if (data.matches.length) {
          bot.setActivity("Watching", data.matches[0].match_name)
          console.log("Watching " + data.matches[0].match_name)
        } else {
          bot.setActivity("Watching", "Dota 2 Twitch Stream")
          console.log("Watching Dota 2 Twitch Stream")
        }
      })
      .catch(function (err) {
        console.error(err)
      });
  }
});

app.get("/dota-procircuit/:type", function (request, response) {
  switch (request.params.type) {
    case "leagues":
      scraper.getLeagues().then(function (data) {
        response.status(200).send(data);
      });
      break;
    case "live-matches":
      scraper.liveMatches().then(function (data) {
        response.status(200).send(data.matches.length ? data.matches : { 'data': 'No live matches found' });
      });
      break;
    default:
      response.status(404).send("Not found");
  }
});

app.get("/meme", function (request, response) {
  scraper.getRandomMeme().then((meme) => {
    response.status(200).json(meme)
    // response.send('<img src="' + meme.url + '">')
  })
})

// TicTacToe api
const TicTacToe = require('./games/tictactoe')
let ttt

app.get('/tictactoe/new/:size', function (request, response) {
  ttt = new TicTacToe('' + Date.now(), parseInt(request.params.size), request.query.player1 || 'Player 1', request.query.player2 || 'Player 2')
  let object = {}
  object.table = ttt.getTable()
  object.players = ttt.players
  object.current = ttt.getCurrentMove()
  object.status = ttt.defaultStatus[ttt.checkMoves()]
  object.winner = ttt.winner
  ttt.printTable()
  response.status(200).json(object)
});

app.get('/tictactoe/move/:x/:y', function (request, response) {
  ttt.setMove(parseInt(request.params.x), parseInt(request.params.y))
  let object = {}
  object.table = ttt.getTable()
  object.players = ttt.players
  object.move = ttt.move
  object.current = ttt.getCurrentMove()
  object.status = ttt.defaultStatus[ttt.checkMoves()]
  object.winner = ttt.winner
  response.status(200).json(object)
});

app.get('/tictactoe/move/:pos', function (request, response) {
  ttt.setMovePos(parseInt(request.params.pos))
  let object = {}
  object.table = ttt.getTable()
  object.players = ttt.players
  object.move = ttt.move
  object.current = ttt.getCurrentMove()
  object.status = ttt.defaultStatus[ttt.checkMoves()]
  object.winner = ttt.winner
  response.status(200).json(object)
});

app.get('/404', function (req, res) {
  res.status(404).render('error', { message: "Whoops!" })
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
  res.redirect('/404')
});

// listen for requests :)
const listener = app.listen(process.env.PORT || 8100, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

bot.startBot();
