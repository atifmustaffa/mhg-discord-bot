const fs = require('fs');
const req = Request
const filename = './views/watchasian/data.json';
var obj = {
    data: []
}

function load() {
    fs.exists(filename, function (exists) {
        if (exists) {
            console.log('file', filename, 'exists', req.query)
        }
        else {
            console.log('file', filename, 'not exists')
        }
    })
}

module.exports = {
    load: load
}