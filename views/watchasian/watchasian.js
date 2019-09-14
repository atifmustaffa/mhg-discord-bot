const fs = require('fs');
const filename = '../views/watchasian/data.json';
var obj = {
    data: []
}

function load() {
    fs.exists(filename, function (exists) {
        if (exists) {
            console.log('file', filename, 'exists')
        }
    })
}

module.exports = {
    load: load
}