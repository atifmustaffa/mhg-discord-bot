module.exports = class TicTacToe {

    constructor(id, size = this.size, players = this.players) {

        // Default values
        this.DEBUG = false
        this.id = '-1'
        this.size = 3
        this.table = Array()
        this.move = 0
        this.defaultStatus = ['Ongoing', 'Draw', 'Ended']
        this.status = -1
        this.winner = -1
        this.players = ['Player 1', 'Player 2']
        this.emptyEmoji = '⬛️'
        this.numberEmoji = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
        this.playerEmoji = ['🅾️', '❎']
        this.numberEmojiDiscord = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:']

        // Avoid even value size
        if (size % 2 === 0) {
            throw console.error('Tictactoe:', 'Cannot create space of even numbers!')
        }

        this.id = id
        this.size = size
        this.table = Array(size).fill().map(() => Array(size).fill(0))
        this.players = players ? players : this.players
    }

    setTable(newTable) {
        this.table = newTable
        this.move = this.size * this.size

        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                if (this.table[x][y] == 0) {
                    this.move--
                }
            }
        }

        this.printMove()
    }

    getTable() {
        return this.table
    }

    getPlayer(i) {
        return this.players[i]
    }

    getCurrentMoveIndex() {
        return (this.move + 1) % 2 != 0 ? 0 : 1
    }

    getCurrentMove() {
        return this.players[this.getCurrentMoveIndex()]
    }

    setMove(x, y) {
        if ((this.move < this.size * this.size) && this.table[x][y] == 0) {
            this.move++

            // Player 1
            if (this.move % 2 != 0) {
                this.table[x][y] = 1
            }
            // Player 2
            else {
                this.table[x][y] = -1
            }

            this.printMove()
        }
    }

    setMovePos(pos) {
        let x = pos % this.size === 0 ? Math.floor(pos / this.size) - 1 : Math.floor(pos / this.size)
        let y = (pos % this.size === 0 ? this.size : pos % this.size) - 1
        this.setMove(x, y)
    }

    checkMoves() {
        // Final checkup (calculate sum)
        let sumCol = Array(this.size).fill(0)
        let sumDiagAsc = 0
        let sumDiagDesc = 0

        for (var x = 0; x < this.size; x++) {
            // Sum row
            let total = this.table[x].reduce((value, prev) => { return value + prev })

            // Check rows
            if (Math.abs(total) == this.size) {
                this.winner = total > 0 ? 0 : 1
                return this.status = 1
            }

            // Sum col
            for (var y = 0; y < this.size; y++) {
                sumCol[y] += this.table[x][y]

                // Check columns
                if (Math.abs(sumCol[y]) == this.size) {
                    this.winner = sumCol[y] > 0 ? 0 : 1
                    return this.status = 1
                }
            }

            // Sum diagonal ascending
            sumDiagAsc += this.table[x][(this.size - 1) - x]

            // Check diagonal ascending
            if (Math.abs(sumDiagAsc) == this.size) {
                this.winner = sumDiagAsc > 0 ? 0 : 1
                return this.status = 1
            }

            // Sum diagonal descending
            sumDiagDesc += this.table[x][x]

            // Check diagonal descending
            if (Math.abs(sumDiagDesc) == this.size) {
                this.winner = sumDiagDesc > 0 ? 0 : 1
                return this.status = 1
            }
        }

        return this.move === this.size * this.size ? 0 : -1
    }

    printTable() {
        let emoji = Array(this.size).fill().map(() => Array(this.size).fill(''))

        // Convert value to player emoji and add padding
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                if (this.table[x][y] === 0) {
                    emoji[x][y] = this.numberEmoji[this.size * x + (y + 1)]
                }
                else {
                    emoji[x][y] = this.playerEmoji[this.table[x][y] > 0 ? 0 : 1]
                }
            }
        }

        // Convert array tables to readable/playable format
        const vSeparatorChar = '|'
        const hSeparatorChar = '-'
        const padding = 1
        const emptyPad = padding * 2 + ('' + this.size * this.size).length
        const hSeparator = Array(this.size * this.size * 3 + this.size * this.size).fill(hSeparatorChar).join('')

        const emptySpaces = (s) => {
            return Array(s).fill(this.emptyEmoji).join('')
        }

        let rows = ''

        for (var x = 0; x < this.size; x++) {
            let rowColsArr = Array(emptyPad).fill('')

            for (var y = 0; y < this.size; y++) {
                let vSeparator = (y !== 0 ? vSeparatorChar : '')

                for (var i = 0; i < emptyPad; i++) {
                    rowColsArr[i] += vSeparator + (i === Math.floor(emptyPad / 2) ? `${emptySpaces(padding)}${emoji[x][y]}${emptySpaces(padding)}` : `${emptySpaces(emptyPad)}`)
                }
            }

            for (var i = 0; i < emptyPad; i++) {
                rows += rowColsArr[i] + '\n'
            }

            rows += (x !== this.size - 1 ? hSeparator + '\n' : '')
        }

        if (this.DEBUG) {
            console.log(rows)
        }

        return rows
    }

    printMove() {
        if (!this.DEBUG) return
        console.log(this.move)

        for (var i = 0; i < this.size; i++) {
            console.log(this.table[i])
        }
    }

}