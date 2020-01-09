const rp = require("request-promise");
const $ = require("cheerio");
const url = "https://liquipedia.net/dota2/Dota_Pro_Circuit/2019-20/Schedule";

async function getHTMLOutput() {
  var htmlOutput;
  await rp(url)
    .then(function(html) {
      //success!
      // console.log(html);
      const leagues = [];
      var rows = $("#mw-content-text > div > table.wikitable tr", html);
      // console.log(rows)
      const header = []
      for (let i = 0; i < rows.length; i++) {
        let count = 0;
        let column = {}
        for (let j = 0; j < rows[i].children.length; j++) {
          if (rows[i].children[j].name == "th") {
            header.push(rows[i].children[j].children[0].data.trim().replace(/\s+/g, '_').toLowerCase())
          }
          else if (rows[i].children[j].name == "td") {
            column[header[count]] = rows[i].children[j].children[0].data.trim();
            count++;
          }
        }
        if (i > 0) leagues.push(column) // Exclude header
      }
//       for (var i = 1; i < rows.length; i++) {
//         console.log(rows[i].childNodes.length)
//         var childNodes = rows[i].childNodes;
//         var columns = [];

//         for (var j = 0; j < childNodes.length; j++) {
//           if (childNodes[j].tagName == "TD") {
//             columns.push(childNodes[j]);
//           }
//         }

//         console.log(columns.length);
//         leagues.push({
//           "title": columns[1].innerHTML,
//           "date": columns[0].innerHTML,
//           "dpc_points": columns[2].innerHTML
//         });
//       }
      // leagues.push(rows[1]);
      // htmlOutput = {"noo": "test"};
      htmlOutput = leagues;
      // console.log(htmlOutput)
    })
    .catch(function(err) {
      //handle error
      console.log(err)
    });
  return htmlOutput;
}
module.exports = {
  getHTMLOutput: getHTMLOutput
};
