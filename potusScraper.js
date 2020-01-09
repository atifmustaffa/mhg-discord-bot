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
          if (rows[i].children[j].name == "th" && rows[i].children[j].children.length == 1) {
            header.push(rows[i].children[j].children[0].data.trim().replace(/\s+/g, '_').toLowerCase())
          }
          else if (rows[i].children[j].name == "td" && rows[i].children[j].children.length == 1) {
            column[header[count]] = rows[i].children[j].children[0].data.trim();
            count++;
          }          
          else if (rows[i].children[j].name == "td" && rows[i].children[j].children.length > 1) {
            column[header[count]] = rows[i].children[j].children[0].children[0].children[0].data.trim();
            count++;
            count = count/0;
          }
        }
        if (i > 0) leagues.push(column) // Exclude header
      }
      // htmlOutput = {"noo": "test"};
      htmlOutput = leagues;
      // console.log(htmlOutput)
    })
    .catch(function(err) {
      //handle error
      console.warn(err)
    });
  return htmlOutput;
}
module.exports = {
  getHTMLOutput: getHTMLOutput
};
