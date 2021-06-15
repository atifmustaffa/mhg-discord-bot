const mongoose = require('mongoose')
const ReminderDB = require('./reminder-model')

const schema = new mongoose.Schema({
    id: String,
    username: String,
    dota_id: [String],
    reminder: [ReminderDB.schema]
})
const model = mongoose.model('User', schema)

function getUser(id) {
    return model.findOne({ id })
}

function addUser(newUser, cb) {
    let user = new model(newUser)
    return user.save(cb)
}

async function setUser(newValue) {
    // Function to add or set existing user
    let user = await getUser(newValue.id)

    if (user) {
        return model.updateOne({ id: newValue.id }, newValue, { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false })
    }
    else {
        return addUser(newValue)
    }
}

async function setManyUser(newValues) {
    let result = Array()

    for (let value of newValues) {
        result.push(await setUser(value))
    }

    return result
}

function deleteUser(id) {
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
    getUser,
    addUser,
    setUser,
    setManyUser,
    deleteUser
}