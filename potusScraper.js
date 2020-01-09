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
      rows.map(function (row, index) {
        console.log("child len ", rows[""+index])
      })
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
      htmlOutput = {"noo": "test"};
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
