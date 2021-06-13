const gameDB = require('./schema-models/game-model')

module.exports = async(messageReaction, user) => {
    // Make sure it is not bot itself
    if (user.bot) {
        return
    }

    // Check if reaction is made onto game message
    let foundGame = await gameDB.getGame(messageReaction.message.id)

    if (foundGame) {
        let gameData = JSON.parse(foundGame.data)

        if (foundGame.game = 'tictactoe') {
            gameData.setMovePos(gameData.numberEmoji.indexOf(messageReaction.emoji.toString()))

            if (gameData.checkMoves() === -1) {
                messageReaction.message.edit(
                    gameData.printTable() +
                    '\nCurrent move: ' +
                    gameData.playerEmoji[gameData.getCurrentMoveIndex()] +
                    ' ' +
                    gameData.getCurrentMove() +
                    '\n'
                )
                // Update game data into db
                gameDB.setGame({
                    _id: messageReaction.message.id,
                    data: JSON.stringify(gameData)
                })
            }
            else {
                let emoji = gameData.checkMoves() === 0 ? '' : gameData.playerEmoji[gameData.winner] + ' '
                let status = gameData.checkMoves() === 0 ? gameData.playerEmoji.join(' Draw ') : (gameData.getPlayer(gameData.winner) + ' wins')
                messageReaction.message.edit(
                    gameData.printTable() +
                    '\n' + emoji + '**' + status + '**\n'
                )
                // Remove completed game from db collection
                gameDB.deleteGame(messageReaction.message.id)
                // Remove all reactions from message
                messageReaction.message.clearReactions()
            }
        }
    }
}