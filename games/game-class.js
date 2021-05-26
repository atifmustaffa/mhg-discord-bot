module.exports = class Game {

    constructor(id, game, players, config) {
        this.id = id || '-1'
        this.game = game.toLowerCase() || 'game'
        this.players = players || ['Player 1']
        this.config = config  || {}
    }

    setConfig(configStr) {
        this.config = Object.assign({}, JSON.parse(configStr))
    }

    getConfigStr() {
        return JSON.stringify(this.config)
    }

}