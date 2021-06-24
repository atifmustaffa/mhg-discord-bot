const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    type: String,
    name: String,
    url: String,
    created_time: {
        type: Date,
        default: Date.now
    }
})
const model = mongoose.model('Activity', schema)

module.exports = {
    schema,
    model
}

function getActivities() {
    return model.find({})
}

function getLatestActivity() {
    return model.findOne({}).sort({ created_time: -1 })
}

function addActivity(newActivity) {
    let activity = new model(newActivity)
    return activity.save()
}

function deleteActivity(name) {
    return model.deleteOne({ name }, errorHandler)
}

function errorHandler(error) {
    if (error) {
        console.error(error)
    }
}

module.exports = {
    schema,
    model,
    getActivities,
    getLatestActivity,
    addActivity,
    deleteActivity,
}