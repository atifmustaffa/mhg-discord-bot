const helper = require('../helper')

module.exports = {
    description: 'Send an Discord Embed DM to specific user in a channel',
    admin: true,
    handler: (message, args) => {
        var userid = helper.convertSnowflake(args.shift())

        if (args.join(' ').includes('```json')) {
            var msg = args.join(' ').split('```json')[0].trim()
            // Remove discord json text styling if used > parse to json
            var embedConfig = JSON.parse(args.join(' ').substr(msg.length).trim().replace(/^((```)(json)(\s)*)|(```)$/g, ''))

            // Fetch users
            message.client.fetchUser(userid, false).then((user) => {
                user.send(msg, embedConfig)
            })
        } else {
            message.channel.send(`Invalid embed attributes`).then(msg => msg.delete(2000))
        }
    }
}