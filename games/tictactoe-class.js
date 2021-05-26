const Game = require('./game-class')

module.exports = class TicTacToe extends Game {

    constructor(id, players, size) {
        let config = {
            DEBUG: false,
            size: size || 3,
            table: Array(),
            move: 0,
            defaultStatus: ['Ongoing', 'Draw', 'Ended'],
            status: -1,
            winner: -1,
            emptyEmoji: '⬛️',
            numberEmoji: ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'],
            playerEmoji: ['🅾️', '❎'],
            numberEmojiDiscord: [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:']
        }
        super(id, 'tictactoe', players || ['Player 1', 'Player 2'], config)

        // Avoid even value size
        if (size % 2 === 0) {
            throw console.error('Tictactoe:', 'Cannot create space of even numbers!')
        }

        this.config.table = Array(size).fill().map(() => Array(size).fill(0))
    }

    setTable(newTable) {
        this.config.table = newTable
        this.config.move = this.config.size * this.config.size

        for (var x = 0; x < this.config.size; x++) {
            for (var y = 0; y < this.config.size; y++) {
                if (this.config.table[x][y] == 0) {
                    this.config.move--
                }
            }
        }

        this.printMove()
    }

    getTable() {
        return this.config.table
    }

    getPlayer(i) {
        return this.players[i]
    }

    getCurrentMoveIndex() {
        return (this.config.move + 1) % 2 != 0 ? 0 : this.players.length > 0 ? 1 : 0
    }

    getCurrentMove() {
        return this.players[this.getCurrentMoveIndex()]
    }

    setMove(x, y) {
        if ((this.config.move < this.config.size * this.config.size) && this.config.table[x][y] == 0) {
            this.config.move++

            // Player 1
            if (this.config.move % 2 != 0) {
                this.config.table[x][y] = 1
            }
            // Player 2
            else {
                this.config.table[x][y] = -1
            }

            this.printMove()
        }
    }

    setMovePos(pos) {
        let x = pos % this.config.size === 0 ? Math.floor(pos / this.config.size) - 1 : Math.floor(pos / this.config.size)
        let y = (pos % this.config.size === 0 ? this.config.size : pos % this.config.size) - 1
        this.setMove(x, y)
    }

    checkMoves() {
        // Final checkup (calculate sum)
        let sumCol = Array(this.config.size).fill(0)
        let sumDiagAsc = 0
        let sumDiagDesc = 0

        for (var x = 0; x < this.config.size; x++) {
            // Sum row
            let total = this.config.table[x].reduce((value, prev) => { return value + prev })

            // Check rows
            if (Math.abs(total) == this.config.size) {
                this.config.winner = total > 0 ? 0 : 1
                return this.config.status = 1
            }

            // Sum col
            for (var y = 0; y < this.config.size; y++) {
                sumCol[y] += this.config.table[x][y]

                // Check columns
                if (Math.abs(sumCol[y]) == this.config.size) {
                    this.config.winner = sumCol[y] > 0 ? 0 : 1
                    return this.config.status = 1
                }
            }

            // Sum diagonal ascending
            sumDiagAsc += this.config.table[x][(this.config.size - 1) - x]

            // Check diagonal ascending
            if (Math.abs(sumDiagAsc) == this.config.size) {
                this.config.winner = sumDiagAsc > 0 ? 0 : 1
                return this.config.status = 1
            }

            // Sum diagonal descending
            sumDiagDesc += this.config.table[x][x]

            // Check diagonal descending
            if (Math.abs(sumDiagDesc) == this.config.size) {
                this.config.winner = sumDiagDesc > 0 ? 0 : 1
                return this.config.status = 1
            }
        }

        return this.config.move === this.config.size * this.config.size ? 0 : -1
    }

    printTable() {
        let emoji = Array(this.config.size).fill().map(() => Array(this.config.size).fill(''))

        // Convert value to player emoji and add padding
        for (var x = 0; x < this.config.size; x++) {
            for (var y = 0; y < this.config.size; y++) {
                if (this.config.table[x][y] === 0) {
                    emoji[x][y] = this.config.numberEmoji[this.config.size * x + (y + 1)]
                }
                else {
                    emoji[x][y] = this.config.playerEmoji[this.config.table[x][y] > 0 ? 0 : 1]
                }
            }
        }

        // Convert array tables to readable/playable format
        const vSeparatorChar = '|'
        const hSeparatorChar = '-'
        const padding = 1
        const emptyPad = padding * 2 + ('' + this.config.size * this.config.size).length
        const hSeparator = Array(this.config.size * this.config.size * 3 + this.config.size * this.config.size).fill(hSeparatorChar).join('')

        const emptySpaces = (s) => {
            return Array(s).fill(this.config.emptyEmoji).join('')
        }

        let rows = ''

        for (var x = 0; x < this.config.size; x++) {
            let rowColsArr = Array(emptyPad).fill('')

            for (var y = 0; y < this.config.size; y++) {
                let vSeparator = (y !== 0 ? vSeparatorChar : '')

                for (var i = 0; i < emptyPad; i++) {
                    rowColsArr[i] += vSeparator + (i === Math.floor(emptyPad / 2) ? `${emptySpaces(padding)}${emoji[x][y]}${emptySpaces(padding)}` : `${emptySpaces(emptyPad)}`)
                }
            }

            for (var i = 0; i < emptyPad; i++) {
                rows += rowColsArr[i] + '\n'
            }

            rows += (x !== this.config.size - 1 ? hSeparator + '\n' : '')
        }

        if (this.config.DEBUG) {
            console.log(rows)
        }

        return rows
    }

    printMove() {
        if (!this.config.DEBUG) return
        console.log(this.config.move)

        for (var i = 0; i < this.config.size; i++) {
            console.log(this.config.table[i])
        }
    }

}