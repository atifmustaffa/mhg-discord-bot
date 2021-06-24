const scraper = require('../scraper')
const tournamentDB = require('../schema-models/tournament-model')
const activityDB =  require('../schema-models/activity-model')

const defaultActivityType = ['Playing', 'Streaming', 'Listening', 'Watching']

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
                    let type = 3, name = liveMatches[0].title
                    bot.user.setActivity(name, { type: defaultActivityType[type] })
                    console.info(bot.user.username, 'is', defaultActivityType[type], name)
                }
                else if (
                    !liveMatches.length &&
                        bot.user.presence.activities.length &&
                        bot.user.presence.activities[0].type === 3 &&
                        bot.user.presence.activities[0].name.indexOf(' vs ') >= 0
                ) {
                    // Check from db for any custom status, if any then reset into custom status
                    activityDB.getActivity(bot.user.id).then((status) => {
                        if (status) {
                            bot.user.setActivity(status.name, { type: defaultActivityType[status.type] })
                            console.info(bot.user.username, 'is', defaultActivityType[status.type], status.name)
                        }
                    })
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }
}