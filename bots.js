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
        console.log(message.author.tag, 'command', command)

        switch (command) {
            case 'hi':
                message.channel.send(`Hey ${message.author}! Nok mintok tulong gapo tu?`);
                break
                
            case 'ping':
                message.reply("pong!");
                break
                
            case 'clearalldata':
                helper.clearAllData()
                message.reply("Ok bosskuu. Removed everything :D")
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
                var getUserId = (arg) => {
                  if (arg === 'my')
                    return message.author.id
                  else if (arg.includes('@'))
                    return args[0].replace(/[<@>]/g, '')
                  else
                    return arg
                }
                var userid = getUserId(args[0])
                if (args[1] === 'dotaid') {
                    helper.saveData(userid, 'dotaid', args[2])
                    message.reply(`Alright I'll remember that`, args[0])
                }
                break
                
            case 'my':
                if (args[0] === 'dotaid') {
                    var value = helper.getData(message.author.id, 'dotaid')
                    message.reply(`Your dotaid is ${value}`)
                }
                else if (args[0] === 'dotabuff') {
                    var value = helper.getData(message.author.id, 'dotaid')
                    message.reply(`Your dotabuff is ${config.dotabuff}players/${value}`)
                }
                break
                
            case 'give':
              var getUserId = (arg) => {
                if (arg === 'my')
                  return message.author.id
                else if (arg.includes('@'))
                  return args[0].replace(/[<@>]/g, '')
                else
                  return arg
              }
              var userid = getUserId(args[0])
              if (args[1] === 'dotaid') {
                  var value = helper.getData(userid, 'dotaid')
                  message.reply(args[0] === 'my' ? `Your dotaid is ${value}` : `<@${userid}> dotaid is ${value}`)
              }
              else if (args[1] === 'dotabuff') {
                  var value = helper.getData(userid, 'dotaid')
                  message.reply(args[0] === 'my' ? `Your dotabuff is ${config.dotabuff}players/${value}` : `<@${userid}> dotabuff is ${config.dotabuff}players/${value}`)
              }
        }
    });
  
    // helper.saveData('atif', 'name', 'Atif')

    client.login(process.env.BOT_TOKEN);
}
module.exports = {
    startBot: startBot
}