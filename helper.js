const fs = require('fs');
var obj = {
   data: []
};

function loadData () {
  fs.exists('data.json', function(exists) {
    if(exists) {
      console.log('exists')
      fs.readFile('data.json', 'utf8', function 
    }
  })  
}

function saveData (userid, attr, value) {
  obj.data.push({ id: userid, attr: attr, value: value })
  //fs.writeFile('data.json', JSON.stringify(obj), 'utf-8', function(err, data){
  //  if (err) console.log(err);
    console.log("Successfully Written to File.", JSON.stringify(obj));
  //});  
}

function getData (userid, attr) {
  
}

module.exports = {
  loadData: loadData,
  saveData: saveData,
  getData: getData
}