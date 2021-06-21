const config = require('./config.json')
const helper =  require('./helper')

const commands = {
    custommeme: require('./commands/custommeme'),
    delete: require('./commands/delete'),
    dm: require('./commands/dm'),
    embeddm: require('./commands/embeddm'),
    embedthis: require('./commands/embedthis'),
    help: require('./commands/help'),
    meme: require('./commands/meme'),
    ping: require('./commands/ping'),
    prefix: require('./commands/prefix'),
    setactivity: require('./commands/setactivity'),
    // tictactoe: require('./commands/tictactoe'),
    tournament: require('./commands/tournament'),
}

module.exports = {
    commands: commands,
    handler: async(message) => {
        // Handle direct message (guild null means dm)
        if (!message.author.bot && !message.guild && commands['dm']) {
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
    }
}