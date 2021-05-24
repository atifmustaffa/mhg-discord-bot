const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.mev9w.mongodb.net/mhg-db?retryWrites=true&w=majority`
const opts = { useNewUrlParser: true, useUnifiedTopology: true }

// Schemas - collection/table
const UserSchema = new mongoose.Schema({
    _id: String,
    name: String
})
const UserModel = mongoose.model('User', UserSchema)

function init() {
    mongoose.connect(uri, opts)
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
    mongoose.connection.once('open', function () {
        console.log('Database connected ✅')
    })
}

function getUser(id) {
    return UserModel.findOne({ _id: id })
}

function setUser(newUser, cb) {
    // let user = new UserModel(newUser)
    // user.save(cb)
    return UserModel.findOneAndUpdate(newUser._id, { name: newUser.name }, { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: true })
}

module.exports = {
    init,
    getUser,
    setUser
}