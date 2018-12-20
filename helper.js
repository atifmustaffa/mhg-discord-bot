const fs = require('fs');
var data = {}

function saveData (userid, attr, value) {
  fs.writeFile('data.json', data, function(err, data){
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });  
}

function getData (userid, attr) {
  
}

module.exports = {
  saveData: saveData,
  getData: getData
}