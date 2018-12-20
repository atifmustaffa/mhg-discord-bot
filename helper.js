const fs = require('fs');
var obj = {
   data: []
};

function saveData (userid, attr, value) {
  obj.data.push({ id: userid, attr: attr, value: value })
  //fs.writeFile('data.json', JSON.stringify(obj), function(err, data){
  //  if (err) console.log(err);
    console.log("Successfully Written to File.", JSON.stringify(obj));
  //});  
}

function getData (userid, attr) {
  
}

module.exports = {
  saveData: saveData,
  getData: getData
}