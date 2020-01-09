const rp = require("request-promise");
const $ = require("cheerio");
const url = "https://liquipedia.net/dota2/Dota_Pro_Circuit/2019-20/Schedule";

async function getHTMLOutput() {
  var htmlOutput = "";
  await rp(url)
    .then(function(html) {
      //success!
      // console.log(html);
      const leagues = [];
      var rows = $("#mw-content-text > div > table.wikitable tr", html);
      for (var i = 0; i < rows.length; i++) {
        var columns = $("td", rows[i]);
        console.log(columns.length)
        leagues.push({
          title: columns[1].innerHTML,
          date: columns[0].innerHTML,
          dpc_points: columns[2].innerHTML
        });
      }
      htmlOutput = JSON.stringify(leagues);
      console.log(htmlOutput)
    })
    .catch(function(err) {
      //handle error
    });
  return htmlOutput;
}
module.exports = {
  getHTMLOutput: getHTMLOutput
};
