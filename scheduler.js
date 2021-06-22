const schedule = require('node-schedule')
const ReminderDB = require('./schema-models/reminder-model')

module.exports = async(bot) => {
    // Execute all scheduled-job modules from files
    const normalizedPath = require('path').join(__dirname, 'scheduled-jobs')
    require('fs').readdirSync(normalizedPath).forEach(function(file) {
        // Checks filename should maintain `-job.js`
        if (!file.endsWith('-job.js')) return
        const job = require('./scheduled-jobs/' + file)
        schedule.scheduleJob(job.date_time, () => {
            job.handler(bot)
        })
    })

    // Execute all schedule-jobs from database
    // Find all reminders that remind_time is not passed yet
    // Then reschedule reminder
    let reminders = await ReminderDB.model.find({ remind_time: { $gt: new Date() }})
    reminders.forEach((reminder) => {
        schedule.scheduleJob(reminder.remind_time, () => {
            bot.fetchUser(reminder.user_id, false).then((user) => {
                user.send('Reminder: ' + reminder.notes)
                user.send(`_Reminder:_ ${reminder.notes}`)
            })
        })
    })
    // Delete expired reminder entry/document from db - cleanup
    ReminderDB.model.deleteMany({ remind_time: { $lte: new Date() }})
        .then((expired_reminders) => {
            if (expired_reminders.length) console.info('Cleaned ' + expired_reminders.length + ' expired reminder(s)')
        })
        .catch((error) => {
            console.log(error)
        })
}