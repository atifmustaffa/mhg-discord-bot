const config = require('./config.json')

const commands = {
    custommeme: require('./commands/custommeme'),
    delete: require('./commands/delete'),
    embedthis: require('./commands/embedthis'),
    help: require('./commands/help'),
    meme: require('./commands/meme'),
    ping: require('./commands/ping'),
    prefix: require('./commands/prefix'),
    senddm: require('./commands/senddm'),
    sendembeddm: require('./commands/sendembeddm'),
    setactivity: require('./commands/setactivity'),
    // tictactoe: require('./commands/tictactoe'),
}

module.exports = {
    commands,
    handler: async(message) => {
        // Check to avoid if message is not a command and not message from bot
        if (!message.content.startsWith(config.prefix) || message.author.bot) return
        // Convert message contents to args
        let args = message.content.slice(config.prefix.length).trim().split(/ +/)
        let command = args.shift().toLowerCase()

        // Perform bot command
        if (commands[command]) {
            // Exit if admin command but user is not an admin
            if (commands[command].admin === true && message.author.id !== config.adminId) return
            commands[command].handler(message, args)
        }
    }
}