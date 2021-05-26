const TicTacToe = require('./games/tictactoe')

module.exports = async (messageReaction, user) => {
    // Make sure it is not bot itself
    if (user.bot) {
        return
    }

    // Check if reaction is made onto game message
    let foundGameIndex = 0 // gamesCollection.findIndex(game => game.id === messageReaction.message.id)

    if (foundGameIndex >= 0) {
        let game = null //gamesCollection[foundGameIndex].game

        // if (game instanceof TicTacToe && gamesCollection[foundGameIndex].players.find(p => p.id === user.id)) {
        if (game instanceof TicTacToe) {
            game.setMovePos(game.numberEmoji.indexOf(messageReaction.emoji.toString()))

            if (game.checkMoves() === -1) {
                messageReaction.message.edit(
                    game.printTable() +
                    '\nCurrent move: ' +
                    game.playerEmoji[game.getCurrentMoveIndex()] +
                    ' ' +
                    game.getCurrentMove() +
                    '\n'
                )
            }
            else {
                let emoji = game.checkMoves() === 0 ? '' : game.playerEmoji[game.winner] + ' '
                let status = game.checkMoves() === 0 ? game.playerEmoji.join(' Draw ') : (game.getPlayer(game.winner) + ' wins')
                messageReaction.message.edit(
                    game.printTable() +
                    '\n' + emoji + '**' + status + '**\n'
                )
                // Remove completed game from collection
                // gamesCollection.splice(foundGameIndex, 1)
                // Remove all reactions from message
                messageReaction.message.clearReactions().then(() => {
                    // console.log(gamesCollection)
                })
            }
        }
    }
}