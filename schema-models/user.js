const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: String,
    name: String,
    data: String
})
const model = mongoose.model('User', schema)

function getUser(id) {
    return model.findOne({ _id: id })
}

function addUser(newUser, cb) {
    let user = new model(newUser)
    return user.save(cb)
}

async function setUser(newValue) {
    // Function to add or set existing user
    let user = await getUser(newValue._id)

    if (user) {
        return model.findOneAndUpdate(newValue._id, newValue, { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false })
    }
    else {
        return addUser(newValue)
    }
}

async function getData(id) {
    let user = await getUser(id)
    return JSON.parse(user.data)
}

module.exports = {
    schema,
    model,
    getUser,
    addUser,
    setUser
}