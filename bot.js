const Discord = require('discord.js')
const scraper = require('./scraper')
const commands = require('./commands')
const reactionsHandler = require('./reactions')
const schedule = require('node-schedule')

const bot = new Discord.Client()

// Bot is ready
bot.on('ready', () => {
    console.info('Bot is ready ✅')
    console.info(`${bot.user.username} is online on ${bot.guilds.size} server(s)!`)

    // Schedule jobs
    const defaultActivityType = ['Playing', 'Streaming', 'Listening', 'Watching']
    // Every 5minutes = */5 * * * *
    schedule.scheduleJob('*/5 * * * *', function(){
        // Only scrap live matches if not a custom status, prevent custom status gets reset
        if (bot.user.presence.activities.length === 0 || (bot.user.presence.activities[0].type === 3 && bot.user.presence.activities[0].name === 'Dota 2 Twitch Stream')) {
            scraper
                .liveMatches()
                .then(function(data) {
                    bot.user.setActivity(data.matches.length ? data.matches[0].match_name : 'Dota 2 Twitch Stream', { type: defaultActivityType[3] })
                    console.info(bot.user.username, 'is', defaultActivityType[3], data.matches.length ? data.matches[0].match_name : 'Dota 2 Twitch Stream')
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    })
})

// Handle commands
bot.on('message', commands.handler)

// Handle reactions
// bot.on('messageReactionAdd', reactionsHandler)

function init() {
    // Start bot
    bot.login(process.env.BOT_TOKEN)
}

module.exports = {
    init,
    client: bot
}