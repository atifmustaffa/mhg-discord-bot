const Discord = require('discord.js')
const scraper = require('./scraper')
const commands = require('./commands')
const reactionsHandler = require('./reactions')
const schedule = require('node-schedule')
const activityDB =  require('./schema-models/activity-model')

const bot = new Discord.Client()

// Bot is ready
bot.on('ready', () => {
    console.info('Bot is ready ✅')
    console.info(`${bot.user.username} is online on ${bot.guilds.size} server(s)!`)

    const defaultActivityType = ['Playing', 'Streaming', 'Listening', 'Watching']

    if (!bot.user.presence.activities.length) {
        // Check from db for any custom status
        activityDB.getActivity(bot.user.id).then((status) => {
            if (status) {
                bot.user.setActivity(status.name, { type: defaultActivityType[status.type] })
                console.info(bot.user.username, 'is', defaultActivityType[status.type], status.name)
            }
        })
    }

    // Schedule jobs
    // Recurrence every 5minutes = */5 * * * *
    schedule.scheduleJob('*/5 * * * *', function() {
        scraper
            .liveMatches()
            .then(function(data) {
                if (
                    (data.matches.length && !bot.user.presence.activities.length) ||
                    (data.matches.length && data.matches[0].match_name !== bot.user.presence.activities[0].name)
                ) {
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
                    // Check from db for any custom status, if any then reset into custom status
                    activityDB.getActivity(bot.user.id).then((status) => {
                        if (status) {
                            bot.user.setActivity(status.name, { type: defaultActivityType[status.type] })
                            console.info(bot.user.username, 'is', defaultActivityType[status.type], status.name)
                        }
                    })
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