const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    id: String,
    name: String
})
const model = mongoose.model('Tournament', schema)

module.exports = {
    schema,
    model
}

function getTournament(id) {
    return model.findOne({ id })
}

function addTournament(newTournament) {
    let tournament = new model(newTournament)
    return tournament.save()
}

async function setTournament(newValue) {
    // Function to add or set existing Tournament
    let tournament = await getTournament(newValue.id)

    if (tournament) {
        return model.updateOne({ id: newValue.id }, newValue, { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false })
    }
    else {
        return addTournament(newValue)
    }
}

function deleteTournament(id) {
    return model.deleteOne({ id })
}

module.exports = {
    schema,
    model,
    getTournament,
    addTournament,
    setTournament,
    deleteTournament,
}