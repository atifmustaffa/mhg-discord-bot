function startBot() {
    const config = require("./config.json");
    const Discord = require("discord.js");
    const client = new Discord.Client();
    const helper = require('./helper.js')
    
    // Loads data from file
    helper.loadData()

    client.on("message", (message) => {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        switch (command) {
            case 'hi':
                message.channel.send(`Hey ${message.author}! Nok mintok tulong gapo deh?`);
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
                break
            case 'remember':
                if (args[1] === 'dotaid') {
                    helper.saveData(args[0] !== 'my' ? args[0] : message.author.id , 'dotaid', args[2])
                    message.reply(`Alright I'll remember that`, args[0])
                }
                break
            case 'what':
                if (args[1] === 'dotaid') {
                    helper.saveData(message.author.id, 'dotaid', args[2])
                    message.reply(`Alright I'll remember that`)
                }
                break
        }
    });
  
    // helper.saveData('atif', 'name', 'Atif')

    client.login(process.env.BOT_TOKEN);
}
module.exports = {
    startBot: startBot
}