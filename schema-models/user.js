const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: String,
    name: String
})
const model = mongoose.model('User', schema)

module.exports = {
    schema,
    model,
    getUser: (id) => {
        return model.findOne({ _id: id })
    },
    setUser: (newUser, cb) => {
        // let user = new UserModel(newUser)
        // user.save(cb)
        return model.findOneAndUpdate(newUser._id, { name: newUser.name }, { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: true })
    }
}