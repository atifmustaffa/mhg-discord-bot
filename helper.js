const fs = require('fs');
const filename = require("./config.json").data_filename;
var obj = {
   data: []
};

function loadData () {
  fs.exists(filename, function(exists) {
    if(exists) {
      fs.readFile(filename, 'utf8', function(err, data) {
        if (err) log(err)
        else {
          if (data !== '') {
            obj = JSON.parse(data)
            log('Data Loaded')
          }
        }
      })
    }
  })  
}

function saveData (userid, attr, value) {
  var dataExists = (dat) => {
    (dat)
  }
  
  if (this.getData(userid, attr))
    this.getData(userid, attr).value = value
  else
    obj.data.push({ id: userid, attr: attr, value: value })
  fs.writeFile(filename, JSON.stringify(obj), 'utf-8', function(err, data){
    if (err) log(err);
    else {
      log("Successfully Written to File.", JSON.stringify({ id: userid, attr: attr, value: value }));
    }
  });
}

function getData (userid, attr) {
  return obj.data.find((d)=> d.id === userid && d.attr === attr)
}


function clearAllData () {
  obj = {
   data: []
  };
  fs.writeFile(filename, '', 'utf-8', function(err, data){
    if (err) log(err);
    else {
      log("Cleared all data");
    }
  });
}

function log(...args) {
  console.log(new Date().toLocaleString(), "->", ...args);
}

module.exports = {
  loadData: loadData,
  saveData: saveData,
  getData: getData,
  clearAllData: clearAllData,
  log: log
}