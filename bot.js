const Discord = require('discord.js')
const commands = require('./commands')
const reactionsHandler = require('./reactions')
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