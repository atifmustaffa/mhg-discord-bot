const scraper = require('../scraper')
const tournamentDB = require('../schema-models/tournament-model')
const activityDB =  require('../schema-models/activity-model')
const helper = require('../helper')
const { ActivityType } = require('../constants')

module.exports = {
    description: 'Periodically change bot activity status',
    date_time: '*/5 * * * *',
    handler: (bot) => {
        scraper
            .getMatches()
            .then(async function(matches) {
                // Filter only live valve tournament
                let liveMatches = matches.filter(match => match.live === true && match.valve_tournament === true)

                // If no valve tournament, check if live tour exist in db
                if (!liveMatches.length) {
                    let tourFromDB = await tournamentDB.getTournaments()

                    if (tourFromDB.length) {
                        liveMatches = matches.filter(match => match.live === true && tourFromDB.map(t => t.name).indexOf(match.tournament) !== -1)
                    }
                }

                if (
                    (liveMatches.length && !bot.user.presence.activities.length) ||
                        (liveMatches.length && liveMatches[0].title !== bot.user.presence.activities[0].name)
                ) {
                    let name = liveMatches[0].title
                    let url = liveMatches[0].streams.length ? liveMatches[0].streams[0].url : ''
                    let type = url !== '' ? ActivityType.STREAMING : ActivityType.WATCHING

                    let activityOpts = { type, url }
                    if (activityOpts.url === '') delete activityOpts.url

                    bot.user.setActivity(name, activityOpts)
                    console.info(bot.user.username, 'is', type, name)
                }
                else if (
                    !liveMatches.length &&
                        bot.user.presence.activities.length &&
                        bot.user.presence.activities[0].type === 3 &&
                        bot.user.presence.activities[0].name.indexOf(' vs ') >= 0
                ) {
                    // Check from db for any custom status, if any then reset into custom status
                    activityDB.getActivities().then((statuses) => {
                        if (statuses.length) {
                            let status = statuses[helper.randomNumber(0, statuses.length)]

                            let activityOpts = { type: status.type, url: status.url }
                            if (activityOpts.url === '') delete activityOpts.url

                            bot.user.setActivity(status.name, activityOpts)
                            console.info(bot.user.username, 'is', status.type, status.name)
                        }
                    })
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }
}