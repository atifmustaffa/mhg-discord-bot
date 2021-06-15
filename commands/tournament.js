const tournamentDB = require('../schema-models/tournament-model')

module.exports = {
    description: 'Manage tournament for bot status',
    admin: true,
    handler: (message, args) => {
        let action = args.shft(), name = args.join(' ')

        switch (action) {
            case 'add':
                // Store new tournament into db
                tournamentDB.setTournament({
                    id: message.client.user.id,
                    name: name
                })
                message.channel.send('Tournament added')
                break

            case 'delete':
                // Delete tournament from db
                tournamentDB.deleteTournament(message.client.user.id)
                message.channel.send('Tournament deleted')
                break

            default:
                message.channel.send('Invalid args')
        }

    }
}