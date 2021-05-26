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

function addGame(newGame) {
    let game = new model(newGame)
    return game.save()
}

async function setGame(newValue) {
    // Function to add or set existing Game
    let game = await getGame(newValue._id)

    if (game) {
        return model.findOneAndUpdate(newValue._id, newValue, { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false })
    }
    else {
        return addGame(newValue)
    }
}

async function getData(id) {
    let game = await getGame(id)
    return game ? JSON.parse(game.data) : null
}

async function setData(id, game, data) {
    return await setGame({
        _id: id,
        game: game,
        data: JSON.stringify(data)
    })
}

function deleteGame(id) {
    return model.deleteOne({ _id: id })
}

module.exports = {
    schema,
    model,
    getGame,
    addGame,
    setGame,
    getData,
    setData,
    deleteGame,
}