module.exports = class TicTacToe {

    DEBUG = false;
    id = '-1'
    size = 3
    table = Array()
    move = 0
    defaultStatus = ['Ongoing', 'Ended']
    status = 0
    winner = ''
    player1 = 'Player 1'
    player2 = 'Player 2'

    constructor(id, size = this.size, player1 = this.player1, player2 = this.player2) {
        if (size % 2 === 0) {
            throw console.error('Tictactoe:', 'Cannot create space of even numbers!')
        }
        this.id = id
        this.size = size
        this.table = Array(size).fill().map(() => Array(size).fill(0))
        this.player1 = player1
        this.player2 = player2
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

    getPlayers() {
        return { player1: this.player1, player2: this.player2 }
    }

    getCurrentMove() {
        return (this.move + 1) % 2 != 0 ? this.player1 : this.player2
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
        // Redundant move fn to prevent recursive (exceed call stack error)
        // if ((this.move < this.size * this.size) && this.table[x][y] == 0) {
        //     this.move++
        //     // Player 1
        //     if (this.move % 2 != 0) {
        //         this.table[x][y] = 1
        //     }
        //     // Player 2
        //     else {
        //         this.table[x][y] = -1
        //     }
        //     this.printMove()
        // }
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
                this.winner = total > 0 ? this.player1 : this.player2
                return this.status = 1
            }
            // Sum col
            for (var y = 0; y < this.size; y++) {
                sumCol[y] += this.table[x][y]
                // Check columns
                if (Math.abs(sumCol[y]) == this.size) {
                    this.winner = sumCol[y] > 0 ? this.player1 : this.player2
                    return this.status = 1
                }
            }
            // Sum diagonal ascending
            sumDiagAsc += this.table[x][(this.size - 1) - x]
            // Check diagonal ascending
            if (Math.abs(sumDiagAsc) == this.size) {
                this.winner = sumDiagAsc > 0 ? this.player1 : this.player2
                return this.status = 1
            }
            // Sum diagonal descending
            sumDiagDesc += this.table[x][x]
            // Check diagonal descending
            if (Math.abs(sumDiagDesc) == this.size) {
                this.winner = sumDiagDesc > 0 ? this.player1 : this.player2
                return this.status = 1
            }
        }
        return 0
    }

    printTable() {
        const emptyEmoji = '⬛️'
        const numberEmoji = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
        const playerEmoji = ['⭕️', '✖️']
        let emoji = Array(this.size).fill().map(() => Array(this.size).fill(''))
        // Convert value to player emoji and add padding
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                if (this.table[x][y] === 0) {
                    emoji[x][y] = numberEmoji[this.size * x + (y + 1)]
                }
                else {
                    emoji[x][y] = playerEmoji[this.table[x][y] > 0 ? 0 : 1]
                }
            }
        }
        // Convert array tables to readable/playable format
        const vSeparatorChar = '|'
        const hSeparatorChar = '-'
        const padding = 1
        const emptyPad = padding * 2 + ('' + this.size * this.size).length
        const hSeparator = Array(emptyPad * this.size * 2 + this.size - 1).fill(hSeparatorChar).join('')
        const emptySpaces = (s) => {
            return Array(s).fill(emptyEmoji).join('')
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
        if (!this.DEBUG) return;
        console.log(this.move)
        for (var i = 0; i < this.size; i++) {
            console.log(this.table[i])
        }
    }

}