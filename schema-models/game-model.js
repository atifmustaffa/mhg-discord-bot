const mongoose = require('mongoose')
const UserDB = require('./user-model')

const schema = new mongoose.Schema({
    id: String,
    name: String,
    players: [UserDB.schema],
    winner: UserDB.schema
})
const model = mongoose.model('Game', schema)

function getGame(id) {
    return model.findOne({ id })
}

function addGame(newGame) {
    let game = new model(newGame)
    return game.save()
}

async function setGame(newValue) {
    // Function to add or set existing Game
    let game = await getGame(newValue.id)

    if (game) {
        return model.updateOne({ id: newValue.id }, newValue, { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false })
    }
    else {
        return addGame(newValue)
    }
}

function deleteGame(id) {
    return model.deleteOne({ id }, errorHandler)
}

function errorHandler(error) {
    if (error) {
        console.error(error)
    }
}

module.exports = {
    schema,
    model,
    getGame,
    addGame,
    setGame,
    deleteGame,
}