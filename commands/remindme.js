const ReminderDB = require('../schema-models/reminder-model')
const schedule = require('node-schedule')

module.exports = {
    description: 'Ask bot to remind you something',
    handler: (message, args) => {
        let remindTimeStr = args.pop()
        let remindNotes = args.join(' ')
        remindNotes = remindNotes.charAt(0).toUpperCase() + remindNotes.slice(1) // Capitalize first char

        let convertStrToDate = (timeStr) => {
            // 1d3h40m
            let digits = timeStr.split(/[A-z]+/).filter(Boolean)
            let types = timeStr.split(/\d+/).filter(Boolean)
            // Check digits and types match, else means formatting is wrong
            if (digits.length !== types.length) return null
            let finalTime = new Date()
            let now = finalTime.getTime()
            types.forEach((type, index) => {
                switch(type) {
                    case 'days':

                    case 'day':

                    case 'd':
                        types[index] = digits[index] > 1 ? 'days' : 'day'
                        finalTime.setDate(finalTime.getDate() + parseInt(digits[index]))
                        break

                    case 'hours':

                    case 'hour':

                    case 'hr':

                    case 'h':
                        types[index] = digits[index] > 1 ? 'hours' : 'hour'
                        finalTime.setHours(finalTime.getHours() + parseInt(digits[index]))
                        break

                    case 'minutes':

                    case 'minute':

                    case 'min':

                    case 'm':
                        types[index] = digits[index] > 1 ? 'minutes' : 'minute'
                        finalTime.setMinutes(finalTime.getMinutes() + parseInt(digits[index]))
                        break
                }
            })
            return finalTime.getTime() > now ? { date: new Date(finalTime), types, digits } : null
        }

        let remindTime = convertStrToDate(remindTimeStr)

        if (!remindTime) {
            message.channel.send('Invalid time. Please try again')
        }
        else {
            // Store new reminder into db
            ReminderDB.setReminder({
                id: message.id,
                user_id: message.author.id,
                notes: remindNotes,
                created_time: new Date(),
                remind_time: remindTime.date
            })

            // Schedule job into future~
            schedule.scheduleJob(remindTime.date, () => {
                message.author.send('Reminder: ' + remindNotes)
            })
            message.channel.send(
                'Noted. Will remind you in `' +
                remindTime.types.map((type, index) => remindTime.digits[index] + type).join(' ') +
                '`'
            )
        }

    }
}