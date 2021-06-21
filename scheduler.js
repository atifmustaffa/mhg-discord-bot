const schedule = require('node-schedule')

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
}