const helper = require('../helper')
const activityDB = require('../schema-models/activity-model')
const { ActivityType } = require('../constants')

module.exports = {
    description: 'Change bot activity status',
    admin: true,
    handler: (message, args) => {
        let action = args.shift()

        switch (action) {
            case 'add':
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

                // Store new activity into db
                activityDB.addActivity({ type, name, url }).then(() => {
                    let activityOpts = { type, url }
                    if (activityOpts.url === '') delete activityOpts.url

                    // Set activity
                    message.client.user.setActivity(name, activityOpts).then(() => {
                        console.info(`${message.client.user.username} is ${type} ${name}`)
                        message.channel.send('Bot activity status changed')
                    })
                })
                break

            case 'set':
                // If args only contain integer, means index used for set existing activity
                if (/^\d+$/.test(args.join(' '))) {
                    let pos = parseInt(args.join(' '))
                    activityDB.getActivities().then(activities => {
                        if (pos < activities.length) {
                            let activity = activities[pos - 1]

                            let activityOpts = { type: activity.type, url: activity.url }
                            if (activityOpts.url === '') delete activityOpts.url

                            // Set activity
                            message.client.user.setActivity(activity.name, activityOpts).then(() => {
                                console.info(`${message.client.user.username} is ${activity.type} ${activity.name}`)
                                message.channel.send('Bot activity status changed')
                            })
                        }
                        else {
                            message.channel.send('Invalid activity selection')
                        }
                    })
                }
                break

            case 'remove':
                // Delete activity from db
                activityDB.deleteActivity(args.join(' ')).then(() => {
                    message.channel.send('Activity removed')
                })
                break

            case 'view':

            default:
                // View activities from db
                activityDB.getActivities().then(acty => {
                    message.channel.send(`\`\`\`\n${acty.map((a, index) => index + 1 + ' ' + a.name).join('\n')}\`\`\``)
                })

        }

    }
}