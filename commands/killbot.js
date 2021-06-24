const config = require('../config')
const SECRET_REACTION = '❤️'

module.exports = {
    description: 'Kill bot [Execute with caution]',
    admin: true,
    hidden: true,
    handler: (message, args) => {
        message.channel.send('Secret reaction?')
            .then(msg => {
                msg.awaitReactions(
                    (reaction, user) => reaction.emoji.name === SECRET_REACTION && user.id === config.adminId,
                    { max: 1, time: 10000 }
                )
                    .then(reaction => {
                        if (reaction.size === 1) {
                            msg.edit('Bot killed').then(m => {
                                m.clearReactions().then(() => {
                                    process.exit()
                                })
                            })
                        }
                    })
            })
    }
}