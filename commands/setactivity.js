const config = require('../config.json')
const defaultActivityType = ['Playing', 'Streaming', 'Listening', 'Watching']

module.exports = {
    description: 'Change bot activity status',
    admin: true,
    handler: (message, args) => {
        let newActivity = args.join(' ')
        let actType = args[0]

        let actTypeIndex = defaultActivityType.findIndex(name => name.toLowerCase() === actType.toLowerCase())
        let activityName = ''

        if (actTypeIndex === -1) { // Not found
            actTypeIndex = 3 // by default set to watching
            activityName = 'Dota 2 Twitch Stream'
        } else {
            activityName = newActivity.slice(actType.length).trim()
        }

        message.client.user.setActivity(activityName, {
            type: defaultActivityType[actTypeIndex]
        })

        console.info(`${message.client.user.username} is ${defaultActivityType[actTypeIndex]} ${activityName}`)
        message.channel.send('Bot activity status changed')
    }
}