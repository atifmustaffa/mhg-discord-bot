const rp = require("request-promise");
const $ = require("cheerio");
const dota_liquipedia_url = "https://liquipedia.net";

async function findURL() {
  const url = dota_liquipedia_url + "/dota2/Main_Page";
  let foundURL = ""
  await rp(url)
    .then(function(html) {
      foundURL = $("#mw-content-text > div > div:nth-child(3) > div.col-xl-6.col-md-7 > div:nth-child(1) > div.panel-body > div:nth-child(3) > a:nth-child(3)", html)[0].attribs.href;
      console.log($("#mw-content-text > div > div:nth-child(3) > div.col-xl-6.col-md-7 > div:nth-child(1) > div.panel-body > div:nth-child(3) > a:nth-child(3)", html).text())
    })
    .catch(function(err) {
      //handle error
      console.error(err)
    });
  return foundURL;
}

async function getLeagues() {
  let htmlOutput;
  // console.log(await findURL())
  const currentYear = new Date().getFullYear();
  const url = dota_liquipedia_url + await findURL();
  await rp(url)
    .then(function(html) {
      //success!
      // console.log(html);
      const name = $("#firstHeading > span", html)[0];
      const leagues = [];
      var rows = $("#mw-content-text > div > table.wikitable tr", html);
      // console.log(rows)
      const header = []
      
      // find last text element
      let lastChild = function(el) {
        if (el.children == null) return el;
        return lastChild(el.children[0])
      }
            
      for (let i = 0; i < rows.length; i++) {
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
      htmlOutput = {
        "name": name.children[0].data.trim().replace(": Schedule", ""),
        "url": url,
        "leagues": leagues 
      };
      // console.log(htmlOutput)
    })
    .catch(function(err) {
      //handle error
      console.error(err)
    });
  return htmlOutput;
}

module.exports = {
  getLeagues: getLeagues,
  findURL: findURL
};
