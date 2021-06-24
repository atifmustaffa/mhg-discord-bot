const activityDB = require('../schema-models/activity-model')
const { ActivityType } = require('../constants')

module.exports = {
    description: 'Change bot activity status',
    admin: true,
    handler: (message, args) => {
        let actType = args.shift() || 'none'
        let url = helper.isValidURL(args[args.length - 1]) ? args.pop() : ''
        let newActivity = args.join(' ') || 'none'

        let actTypeIndex = ActivityType.findIndex(name => name.toLowerCase() === actType.toLowerCase())
        let activityName = ''

        if (actTypeIndex === -1) { // Not found
            actTypeIndex = 3 // by default set to watching
            activityName = 'Dota 2 Twitch Stream'
        } else {
            activityName = newActivity.trim()
        }

        // Store new activity into db
        activityDB.setActivity({
            id: message.client.user.id,
            type: actTypeIndex,
            name: activityName
        })

        message.client.user.setActivity(activityName, {
            type: defaultActivityType[actTypeIndex]
        })

        console.info(`${message.client.user.username} is ${ActivityType[actTypeIndex]} ${activityName}`)
        message.channel.send('Bot activity status changed')
    }
}