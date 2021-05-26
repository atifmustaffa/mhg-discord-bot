const Discord = require('discord.js')
const scraper = require('./scraper')
const commands = require('./commands')
const reactionsHandler = require('./reactions')

const bot = new Discord.Client()

// Bot is ready
bot.on('ready', () => {
    console.info('Bot is ready ✅')
    console.info(`${bot.user.username} is online on ${bot.guilds.size} server(s)!`)
    let activityType = 'Watching'
    scraper
        .liveMatches()
        .then(function (data) {
            bot.user.setActivity(data.matches.length ? data.matches[0].match_name : 'Dota 2 Twitch Stream', { type: activityType })
            console.info(activityType, data.matches.length ? data.matches[0].match_name : 'Dota 2 Twitch Stream')
        })
        .catch((error) => {
            console.error(error)
        })
})

// Handle commands
bot.on('message', commands.handler)

// Handle reactions
bot.on('messageReactionAdd', reactionsHandler)

function init() {
    // Start bot
    bot.login(process.env.BOT_TOKEN)
}

module.exports = {
    init,
    client: bot
}