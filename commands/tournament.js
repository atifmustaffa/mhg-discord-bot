const tournamentDB = require('../schema-models/tournament-model')

module.exports = {
    description: 'Manage tournament for bot status',
    admin: true,
    handler: (message, args) => {
        let action = args.shift(), name = args.join(' ')

        switch (action) {
            case 'add':
                // Store new tournament into db
                tournamentDB.addTournament(name).then(() => {
                    message.channel.send('Tournament added')
                })
                break

            case 'remove':
                // Delete tournament from db
                tournamentDB.deleteTournament(name).then(() => {
                    message.channel.send('Tournament removed')
                })
                break

            case 'view':
                // View tournaments from db
                tournamentDB.getTournaments().then(tours => {
                    message.channel.send(`\`\`\`\n${tours.map((t, index) => index + 1 + ' ' + t.name).join('\n')}\`\`\``)
                })
                break

            default:
                message.channel.send('Invalid args')
        }
    }
}