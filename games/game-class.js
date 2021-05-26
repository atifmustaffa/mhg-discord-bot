module.exports = class Game {

    constructor(id, game, players) {
        this.id = id || '-1'
        this.game = game.toLowerCase() || 'game'
        this.players = players || ['Player 1']
    }

}