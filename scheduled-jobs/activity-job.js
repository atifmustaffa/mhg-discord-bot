const scraper = require('../scraper')
const tournamentDB = require('../schema-models/tournament-model')
const activityDB =  require('../schema-models/activity-model')

const defaultActivityType = ['Playing', 'Streaming', 'Listening', 'Watching']

module.exports = {
    description: 'Periodically change bot activity status',
    date_time: '*/5 * * * *',
    handler: (bot) => {
        scraper
            .liveMatches()
            .then(async function(data) {
                // Filter only live valve tournament
                let liveMatches = data.matches.filter(match => match.is_valve === true)

                // If no valve tournament, check if tour exist in db
                if (!liveMatches.length) {
                    let tourFromDB = await tournamentDB.getTournament(bot.user.id)

                    if (tourFromDB) {
                        liveMatches = data.matches.filter(match => match.is_valve === false && match.tournament_name === tourFromDB.name)
                    }
                }

                if (
                    (liveMatches.length && !bot.user.presence.activities.length) ||
                        (liveMatches.length && liveMatches[0].name !== bot.user.presence.activities[0].name)

                ) {
                    let type = 3, name = liveMatches[0].name
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