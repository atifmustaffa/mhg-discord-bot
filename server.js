// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("message", (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'hi':
            message.channel.send(`Hey ${message.author}! Nok mintok tulong gapo deh hh?`);
            break
        case 'ping':
            message.reply("pong!");
            break
        case 'dotabuff':
            if (args[0] === 'match')
                message.reply(`Check out your match here ${config.dotabuff}matches/${args[1]}`)
            else if (args[0] === 'player')
                message.reply(`Check out player history here ${config.dotabuff}players/${args[1]}`)
            else
                message.reply(`Invalid command bro. Please insert type and id eg: !dotabuff player 100846798`)
    }
});

client.login(process.env.BOT_TOKEN);