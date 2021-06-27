const Discord = require('discord.js')
const commands = require('./commands')
const reactionsHandler = require('./reactions')
const activityDB =  require('./schema-models/activity-model')
const { randomNumber } = require('./helper')

const bot = new Discord.Client()

// Bot is ready
bot.on('ready', () => {
    console.info('Bot is ready ✅')
    console.info(`${bot.user.username} is online on ${bot.guilds.size} server(s)!`)

    if (!bot.user.presence.activities.length) {
        // Check from db for any custom status
        activityDB.getActivities().then((statuses) => {
            if (statuses.length) {
                let status = statuses[randomNumber(0, statuses.length)]

                let activityOpts = { type: status.type, url: status.url }
                if (activityOpts.url === '') delete activityOpts.url

                bot.user.setActivity(status.name, activityOpts)
                console.info(bot.user.username, 'is', status.type, status.name)
            }
        })
    }

    // Execute job scheduler
    require('./scheduler')(bot)
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