const config = require('../config.json')

module.exports = {
    description: 'Show a list of commands available for MHG Bot',
    handler: (message, args) => {
        // Generate discord embed (beautify commands list)
        let list = Object.keys(args).sort().filter(cmd => !args[cmd].hidden).map((command) => {
            // Only command that is not set hidden
            return {
                name: command,
                value: args[command].admin === true ? '[_Admin_] ' + args[command].description : args[command].description
            }
        })
        const embed = {
            "title": "MHG - Available Commands\n",
            "color": parseInt(config.color.orange),
            "thumbnail": {
                "url": "https://media.discordapp.net/attachments/660818037292924938/714796385781940234/mhg-250x150.png"
            },
            "fields": list
        }
        message.channel.send({ embed })
    }
}