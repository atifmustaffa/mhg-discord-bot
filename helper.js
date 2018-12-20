const fs = require('fs');
var obj = {
   data: []
};

function loadData () {
  fs.exists('data.json', function(exists) {
    if(exists) {
      console.log('exists')
      fs.readFile('data.json', 'utf8', function(err, data) {
        if (err) console.log(err)
        else {
          if (data !== '') {
            obj = JSON.parse(data)
            console.log('data loaded', JSON.stringify(obj))
          }
        }
      })
    }
  })  
}

function saveData (userid, attr, value) {
  obj.data.push({ id: userid, attr: attr, value: value })
  fs.writeFile('data.json', JSON.stringify(obj), 'utf-8', function(err, data){
    if (err) console.log(err);
    else {
      console.log("Successfully Written to File.", JSON.stringify(obj));
    }
  });
}

function getData (userid, attr) {
  return obj.data.find((d)=> d.id === userid && d.attr === attr).value
}


function clearAllData () {
  obj = {
   data: []
  };
  fs.writeFile('data.json', '', 'utf-8', function(err, data){
    if (err) console.log(err);
    else {
      console.log("Cleared all data");
    }
  });
}

module.exports = {
  loadData: loadData,
  saveData: saveData,
  getData: getData,
  clearAllData: clearAllData
}