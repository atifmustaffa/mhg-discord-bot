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

    // Recurrence every 5minutes = */5 * * * *
    schedule.scheduleJob('*/5 * * * *', function(){
        // if (bot.user.presence.activities.length === 0 || (bot.user.presence.activities[0].type === 3 && bot.user.presence.activities[0].name === 'Dota 2 Twitch Stream')) {
        scraper
            .liveMatches()
            .then(function(data) {
                if (data.matches.length) {
                    let type = 3, name = data.matches[0].match_name
                    bot.user.setActivity(name, { type: defaultActivityType[type] })
                    console.info(bot.user.username, 'is', defaultActivityType[type], name)
                }
                else if (
                    !data.matches.length &&
                    bot.user.presence.activities.length &&
                    bot.user.presence.activities[0].type === 3 &&
                    bot.user.presence.activities[0].name.indexOf(' vs ') >= 0
                ) {
                    let type = 3, name = 'Dota 2 Twitch Stream'
                    bot.user.setActivity(name, { type: defaultActivityType[type] })
                    console.info(bot.user.username, 'is', defaultActivityType[type], name)
                }
            })
            .catch((error) => {
                console.error(error)
            })
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