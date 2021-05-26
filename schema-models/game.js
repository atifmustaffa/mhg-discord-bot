const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: String,
    game: String
})
const model = mongoose.model('Game', schema)

module.exports = {
    schema,
    model,
}