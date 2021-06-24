const helper = require('../helper')
const activityDB = require('../schema-models/activity-model')
const { ActivityType } = require('../constants')

module.exports = {
    description: 'Change bot activity status',
    admin: true,
    handler: (message, args) => {
        // If not args/empty then set to default activity
        if (!args.length) {
            args.push(ActivityType.WATCHING, 'Dota 2 Twitch Stream')
        }

        let action = args.shift()

        switch (action) {
            case 'view':
                // View activities from db
                activityDB.getActivities().then(acty => {
                    message.channel.send(`\`\`\`\n${acty.map(a => a.name).join('\n')}\`\`\``)
                })
                break

            case 'remove':
                // Delete activity from db
                activityDB.deleteActivity(name).then(() => {
                    message.channel.send('Activity removed')
                })
                break

            case 'add':

            case 'set':

            default:
                // Re-add into args
                if (action !== 'add' || action !== 'set') {
                    args =  [type, ...args]
                }

                let type = args.shift()

                // If type is not exists in constants, means custom status
                if (type.toUpperCase() in ActivityType) {
                    type = ActivityType[type.toUpperCase()]
                }
                else {
                    // Re-add into args
                    args =  [type, ...args]
                    type =  ActivityType.CUSTOM_STATUS
                }

                let url = helper.isValidURL(args[args.length - 1]) ? args.pop() : ''
                let name = args.join(' ')

                let activityOpts = { type, url }
                if (activityOpts.url === '') delete activityOpts.url

                // Store new activity into db
                activityDB.addActivity({ type, name, url })

                // Set activity
                message.client.user.setActivity(name, activityOpts)

                console.info(`${message.client.user.username} is ${type} ${name}`)
                message.channel.send('Bot activity status changed')
        }

    }
}