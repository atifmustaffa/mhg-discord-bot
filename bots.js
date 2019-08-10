function startBot() {
    const config = require("./config.json");
    const Discord = require("discord.js");
    const bot = new Discord.Client();
    const helper = require('./helper.js');
    const commands = require('./commands.json');

    // Loads data from file
    helper.loadData()

    bot.on("ready", async () => {
        helper.log(`${bot.user.username} is online on ${bot.guilds.size} server(s)!`);
        bot.user.setActivity(`Lacasa De Papel`, {
            type: "Watching"
        });
    });

    bot.on("message", (message) => {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        helper.log('user:', message.author.tag, 'command:', message.content.toLowerCase())

        switch (command) {
            case 'help':
                const embed = {
                    "title": "title ~~(did you know you can have markdown here too?)~~",
                    "description": "this supports [named links](https://discordapp.com) on top of the previously shown subset of markdown. ```\nyes, even code blocks```",
                    "url": "https://discordapp.com",
                    "color": 14422655,
                    "timestamp": new Date(2019, 7, 10, 0, 51, 00),
                    "footer": {
                        "text": "Last updated"
                    },
                    "thumbnail": {
                        "url": "https://cdn.discordapp.com/embed/avatars/0.png"
                    },
                    "image": {
                        "url": "https://cdn.discordapp.com/embed/avatars/0.png"
                    },
                    "author": {
                        "name": "author name",
                        "url": "https://discordapp.com",
                        "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
                    },
                    "fields": commands.commands
                };
                // [
                //     {
                //         "name": "🤔",
                //         "value": "some of these properties have certain limits..."
                //     },
                //     {
                //         "name": "😱",
                //         "value": "try exceeding some of them!"
                //     },
                //     {
                //         "name": "🙄",
                //         "value": "an informative error should show up, and this view will remain as-is until all issues are fixed"
                //     },
                //     {
                //         "name": "<:thonkang:219069250692841473>",
                //         "value": "these last two",
                //         "inline": true
                //     },
                //     {
                //         "name": "<:thonkang:219069250692841473>",
                //         "value": "are inline fields",
                //         "inline": true
                //     }
                // ]
                message.channel.send({ embed });
                break;

            case 'hi':
                message.channel.send(`Hey ${message.author}!`);
                break

            case 'ping':
                message.reply("pong!");
                break

            case 'clearalldata':
                if (message.author.id === config.adminId) {
                    helper.clearAllData()
                    message.reply("Ok bosskuu. Removed everything :D")
                }
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
                    var value = helper.getData(message.author.id, 'dotaid').value
                    message.reply(`Your dotaid is ${value}`)
                }
                else if (args[0] === 'dotabuff') {
                    var value = helper.getData(message.author.id, 'dotaid').value
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
                    var value = helper.getData(userid, 'dotaid').value
                    message.reply(args[0] === 'my' ? `Your dotaid is ${value}` : `<@${userid}> dotaid is ${value}`)
                }
                else if (args[1] === 'dotabuff') {
                    var value = helper.getData(userid, 'dotaid').value
                    message.reply(args[0] === 'my' ? `Your dotabuff is ${config.dotabuff}players/${value}` : `<@${userid}> dotabuff is ${config.dotabuff}players/${value}`)
                }
                break
        }
    });

    // helper.saveData('atif', 'name', 'Atif')

    bot.login(process.env.BOT_TOKEN);
}
module.exports = {
    startBot: startBot
}