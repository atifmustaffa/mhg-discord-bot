const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: String,
    game: String,
    data: String,
})
const model = mongoose.model('Game', schema)

function getGame(id) {
    return model.findOne({ _id: id })
}

function addGame(newGame, cb) {
    let game = new model(newGame)
    return game.save(cb)
}

async function setGame(newValue, cb) {
    // Function to add or set existing Game
    let game = await getGame(newValue._id)

    if (game) {
        return model.findOneAndUpdate(newValue._id, newValue, { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false })
    }
    else {
        return addGame(newValue, cb)
    }
}

async function getData(id) {
    let game = await getGame(id)
    return JSON.parse(game.data)
}

module.exports = {
    schema,
    model,
    getGame,
    addGame,
    setGame
}