const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    id: String,
    type: Number,
    name: String
})
const model = mongoose.model('Activity', schema)

module.exports = {
    schema,
    model
}

function getActivity(id) {
    return model.findOne({ id })
}

function addActivity(newActivity) {
    let activity = new model(newActivity)
    return activity.save()
}

async function setActivity(newValue) {
    // Function to add or set existing Activity
    let activity = await getActivity(newValue.id)

    if (activity) {
        return model.updateOne({ id: newValue.id }, newValue, { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false })
    }
    else {
        return addActivity(newValue)
    }
}

function deleteActivity(id) {
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
    getActivity,
    addActivity,
    setActivity,
    deleteActivity,
}