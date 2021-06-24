const config = require('../config')

module.exports = {
    description: 'Return the bot prefix used for commands',
    handler: (message, args) => {
        message.channel.send('Prefix: `' + config.prefix + '`')
    }
}