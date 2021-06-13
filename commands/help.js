const commands = require('../commands')
const config = require('../config.json')

module.exports = {
    description: 'Show a list of commands available for MHG Bot',
    handler: (message, args) => {
        // Generate discord embed (beautify commands list)
        let list = Object.keys(commands.commands).map((command) => {
            return {
                name: command,
                value: commands.commands[command].admin === true ? '[Admin] ' + commands.commands[command].description : commands.commands[command].description
            }
        })
        const embed = {
            "description": "MHG - Available Commands\n",
            "color": parseInt(config.color.orange),
            "thumbnail": {
                "url": "https://media.discordapp.net/attachments/660818037292924938/714796385781940234/mhg-250x150.png"
            },
            "fields": list
        }
        message.channel.send({ embed })
    }
}