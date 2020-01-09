const rp = require("request-promise");
const $ = require("cheerio");
const url = "https://liquipedia.net/dota2/Dota_Pro_Circuit/2019-20/Schedule";
const name = ""

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
      
      // find last text element
      let lastChild = function(el) {
        if (el.children == null) return el;
        return lastChild(el.children[0])
      }
            
      for (let i = 0; i < rows.length-11; i++) {
        let count = 0;
        let column = {}
        for (let j = 0; j < rows[i].children.length; j++) {
          if (rows[i].children[j].name == "th") {
            header.push(lastChild(rows[i].children[j]).data.trim().replace(/\s+/g, '_').toLowerCase())
          }
          else if (rows[i].children[j].name == "td") {
            column[header[count]] = lastChild(rows[i].children[j]).data.trim();
            count++;
          } 
        }
        if (i > 0) leagues.push(column) // Exclude header
      }
      // htmlOutput = {"noo": "test"};
      htmlOutput = { "leagues": leagues };
      // console.log(htmlOutput)
    })
    .catch(function(err) {
      //handle error
      console.error(err)
    });
  return htmlOutput;
}
module.exports = {
  getHTMLOutput: getHTMLOutput
};
