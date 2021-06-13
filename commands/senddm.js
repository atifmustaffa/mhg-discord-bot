const helper = require('../helper')

module.exports = {
    description: 'Send DM to specific user in a channel',
    admin: true,
    handler: (message, args) => {
        var userid = helper.convertSnowflake(args.shift())
        var msg = args.join(' ')
        // Fetch users
        message.client.fetchUser(userid, false).then((user) => {
            user.send(msg)
        })
    }
}