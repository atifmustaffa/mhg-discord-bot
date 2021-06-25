const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    created_time: {
        type: Date,
        default: Date.now
    }
})
const model = mongoose.model('Tournament', schema)

module.exports = {
    schema,
    model
}

function getTournaments() {
    return model.find({})
}

function addTournament(newTournament) {
    let tournament = new model({ name: newTournament })
    return tournament.save()
}

function deleteTournament(name) {
    return model.deleteOne({ name: { $regex: new RegExp(`^${name}$`), $options: 'i' } }, errorHandler)
}

function errorHandler(error) {
    if (error) {
        console.error(error)
    }
}

module.exports = {
    schema,
    model,
    getTournaments,
    addTournament,
    deleteTournament,
}