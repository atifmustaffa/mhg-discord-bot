const fs = require('fs');
const filename = './views/watchasian/data.json';
var obj = {
    data: []
}
const sample_obj = {
    data: [
        {
            "title": "Running Man",
            "link": "https://dramafast.com/show/running-man/"
        },
        {
            "title": "Doctor John",
            "link": "https://dramafast.com/drama/doctor-john/"
        }
    ]
}
const sample_uri = `%7B%22data%22%3A%5B%7B%22title%22%3A%22Running%20Man%22%2C%22link%22%3A%22https%3A%2F%2Fdramafast.com%2Fshow%2Frunning-man%2F%22%7D%2C%7B%22title%22%3A%22Doctor%20John%22%2C%22link%22%3A%22https%3A%2F%2Fdramafast.com%2Fdrama%2Fdoctor-john%2F%22%7D%5D%7D`


function load(param) {
    fs.exists(filename, function (exists) {
        if (exists) {
            // console.log('param:', param)
            obj = JSON.parse(decodeURIComponent(param))
            // console.log(obj.data)
            fs.writeFile(filename, JSON.stringify(obj), 'utf-8', function (err, data) {
                if (err) console.log(err);
            });
        }
    })
}

module.exports = {
    load: load
}