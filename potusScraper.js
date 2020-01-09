const rp = require("request-promise");
const $ = require("cheerio");
const url = "https://liquipedia.net/dota2/Dota_Pro_Circuit/2019-20/Schedule";
const selector = "#mw-content-text > div > table.wikitable tr";
async function getHTMLOutput() {
  var htmlOutput = "";
  await rp(url)
    .then(function(html) {
      //success!
      // console.log(html);
      const leagues = [];
      var row = $(selector, html);
    })
    .catch(function(err) {
      //handle error
    });
  return htmlOutput;
}
module.exports = {
  getHTMLOutput: getHTMLOutput
};
