const  { format } = require('date-fns')
const ReminderDB = require('../schema-models/reminder-model')
const config = require('../config.json')

module.exports = {
    description: 'Display a list of your ongoing reminders',
    handler: (message, args) => {
        // Find reminders associated with user and is not expired
        ReminderDB.model.find({ user_id: message.author.id, remind_time: { $gt: new Date() }})
            .then((reminders) => {
                if (reminders.length) {
                    let reminderList = reminders.map((reminder) => {
                        return {
                            name: format(reminder.remind_time, 'EEE, dd MMM yyyy, hh:mm:ss a'),
                            value: reminder.notes
                        }
                    })
                    const embed = {
                        "description": "Ongoing Reminders",
                        "color": parseInt(config.color.orange),
                        "fields": reminderList
                    }
                    message.channel.send({ embed })
                }
                else {
                    message.channel.send('You have no reminders')
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
}