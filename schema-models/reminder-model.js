const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    id: String,
    notes: String,
    created_time: Date,
    remind_time: Date
})
const model = mongoose.model('Reminder', schema)

module.exports = {
    schema,
    model
}

function getReminder(id) {
    return model.findOne({ id })
}

function addReminder(newReminder) {
    let reminder = new model(newReminder)
    return reminder.save()
}

async function setReminder(newValue) {
    // Function to add or set existing Reminder
    let reminder = await getReminder(newValue.id)

    if (reminder) {
        return model.updateOne({ id: newValue.id }, newValue, { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false })
    }
    else {
        return addReminder(newValue)
    }
}

function deleteReminder(id) {
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
    getReminder,
    addReminder,
    setReminder,
    deleteReminder,
}