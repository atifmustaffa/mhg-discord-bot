// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();

const http = require("http");
const bot = require("./bots.js");
const scraper = require("./potusScraper.js");

// Database
const database = require('./class/Database.js')

app.set('view engine', 'ejs');
app.use(express.static("public"));

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
  ttt = new TicTacToe('' + Date.now(), parseInt(request.params.size), request.query.players)
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
  object.status = ttt.defaultStatus[ttt.checkMoves() + 1]
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
  object.status = ttt.defaultStatus[ttt.checkMoves() + 1]
  object.winner = ttt.winner
  response.status(200).json(object)
});

app.get('/db/set/:type', async function (request, response) {
  let id = request.query['id'] || ''
  let name = request.query['name'] || ''
  let value = {}
  switch (request.params.type) {
    case 'user':
      let obj = {}
      if (id !== '')
        obj._id = id
      obj.name = name
      value = await database.setUser(obj)
      break
  }
  response.status(200).json(value)
})

app.get('/db/get/:type', async function (request, response) {
  let param = request.query['param'] || ''
  let value = {}
  switch (request.params.type) {
    case 'user':
      value = await database.getUser(param)
      break
  }
  response.status(200).json(value)
})

app.get('/404', function (req, res) {
  res.status(404).render('error', { message: "Whoops!" })
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
  res.redirect('/404')
});

// listen for requests :)
const listener = app.listen(process.env.PORT || 8100, function () {
  database.init()
  console.log("Your app is listening on port " + listener.address().port);
});

bot.startBot();
