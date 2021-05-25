const config = require('./config.json')

const commands = {
    ping: require('./commands/ping'),
    tictactoe: require('./commands/tictactoe'),
}

module.exports = {
    commands,
    handler: async (message) => {
        // Check to avoid if message is not a command and not message from bot
        if (!message.content.startsWith(config.prefix) || message.author.bot) return
        // Convert message contents to args
        let args = message.content.slice(config.prefix.length).trim().split(/ +/)
        let command = args.shift().toLowerCase()

        // Perform bot command
        if (commands[command]) {
            commands[command].handler(message, args)
        }
    }
}