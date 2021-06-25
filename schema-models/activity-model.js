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
    // Add only if not exists
    return model.findOneAndUpdate({}, newActivity, { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false })
}

function deleteActivity(name) {
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
    getActivities,
    getLatestActivity,
    addActivity,
    deleteActivity,
}