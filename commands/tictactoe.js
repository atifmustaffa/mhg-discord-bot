const config = require('../config.json')
const helper = require('../helper')
const TicTacToe = require('../games/tictactoe-class')
const gameDB = require('../schema-models/game')

module.exports = {
    description: 'Start a tictactoe game by tagging an opponent',
    handler: async(message, args) => {
        if (args.length !== 1) {
            message.channel.send(
                'Please tag your opponent. Eg:`' +
                config.prefix +
                'tictactoe `' +
                helper.convertToSnowflake(config.adminId)
            ).then(msg => msg.delete(5000))
            return
        }
        else {
            var players = Array()
            // Fetch users into array
            players.push(await message.client.fetchUser(message.author.id, false))
            players.push(await message.client.fetchUser(helper.convertSnowflake(args.shift()), false))
            let size = 3
            let tictactoe = new TicTacToe(players[0].id, players.map((u) => { return u.username }), size)
            // Send temp loading game info
            message.channel.send(
                tictactoe.config.playerEmoji[0] + ' TicTacToe ' + tictactoe.config.playerEmoji[1] + ' _Loading game..._'
            ).then(async(msg) => {
                // Add number reactions
                for (var i = 1; i <= size * size; i++) {
                    await msg.react(tictactoe.config.numberEmoji[i])

                    // On last reaction, edit message with tictactoe table
                    if (i === size * size) {
                        msg.edit(
                            tictactoe.printTable() +
                            '\nCurrent move: ' +
                            tictactoe.config.playerEmoji[tictactoe.getCurrentMoveIndex()] +
                            ' ' +
                            tictactoe.getCurrentMove() +
                            '\n'
                        )
                        // Store game data into db
                        gameDB.addGame({
                            _id: msg.id,
                            game: 'tictactoe',
                            data: tictactoe.getConfigStr()
                        })
                    }
                }
            })
        }
    }
}