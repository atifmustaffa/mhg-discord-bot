const rp = require("request-promise");
const url = "https://liquipedia.net/dota2/Dota_Pro_Circuit/2019-20/Schedule";

async function getHTMLOutput() {
  var htmlOutput = "";
  rp(url)
    .then(function(html) {
      //success!
      // console.log(html);
      htmlOutput = html;
    })
    .catch(function(err) {
      //handle error
    });
  return htmlOutput;
}
module.exports = {
  getHTMLOutput: getHTMLOutput
};
