const mongoose = require('mongoose')

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.mev9w.mongodb.net/mhg-db?retryWrites=true&w=majority`
const opts = { useNewUrlParser: true, useUnifiedTopology: true }

function init() {
    mongoose.connect(uri, opts)
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
    mongoose.connection.once('open', function () {
        console.info('Database connected ✅')
    })
}

module.exports = {
    init
}