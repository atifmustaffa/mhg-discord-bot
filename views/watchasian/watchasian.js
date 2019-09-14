const fs = require('fs');
const filename = '/views/watchasian/data.json';
var obj = {
  data: []
}

fs.exists(filename, function (exists) {
    if (exists) {
        console.log('file', filename, 'exists')
    }
})