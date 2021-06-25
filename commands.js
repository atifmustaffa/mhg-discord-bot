const config = require('./config')
const helper =  require('./helper')

const commands = {
    activity: require('./commands/activity'),
    custommeme: require('./commands/custommeme'),
    delete: require('./commands/delete'),
    dm: require('./commands/dm'),
    embeddm: require('./commands/embeddm'),
    embedthis: require('./commands/embedthis'),
    help: require('./commands/help'),
    killbot: require('./commands/killbot'),
    meme: require('./commands/meme'),
    ping: require('./commands/ping'),
    prefix: require('./commands/prefix'),
    reminders: require('./commands/reminders'),
    remindme: require('./commands/remindme'),
    // tictactoe: require('./commands/tictactoe'),
    tournament: require('./commands/tournament'),
}

module.exports = {
    commands: commands,
    handler: async(message) => {
        // Handle direct message (guild null means dm)
        if (!message.author.bot && !message.guild && commands['dm'].handler) {
            // Use existing dm command to forward msg to admin
            commands['dm'].handler(
                message, [
                    config.adminId, `_Forwarded from_${helper.convertToSnowflake(message.author.id)}\n${message.content}`
                ]
            )
        }

        // Check to avoid if message is not a command or not a message from bot
        if (!message.content.startsWith(config.prefix) || message.author.bot) return
        // Convert message contents to args
        let args = message.content.slice(config.prefix.length).trim().split(/ +/)
        let command = args.shift().toLowerCase()

        if (commands[command]) {
            // Exit if admin command but user is not an admin
            if (commands[command].admin === true && message.author.id !== config.adminId) return
            // Perform bot command
            commands[command].handler(message, command === 'help' ? commands : args)
        }
        else {
            // Check for command aliases
            // Built this way so that aliases do not overrides main command (if command and alias is same)
            for (var key of Object.keys(commands)) {
                if (!commands[key].aliases || !commands[key].aliases.length) continue

                let index = commands[key].aliases.indexOf(command)

                if (index >= 0) {
                    // Alias found, execute command handler
                    commands[key].handler(message, key === 'help' ? commands : args)
                }
            }
        }
    }
}