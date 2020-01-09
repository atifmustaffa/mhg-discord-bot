const rp = require("request-promise");
const cheerio = require("cheerio");
const dota_liquipedia_url = "https://liquipedia.net";

async function findURL() {
  const url = dota_liquipedia_url + "/dota2/Main_Page";
  let foundURL = ""
  await rp(url)
    .then(function(html) {
      const $ = cheerio.load(html)
      foundURL = $("#mw-content-text > div > div:nth-child(3) > div.col-xl-6.col-md-7 > div:nth-child(1) > div.panel-body > div:nth-child(3) > a:nth-child(3)", html).attr("href");
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
      const $ = cheerio.load(html)
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

async function liveTournament() {  
  const url = dota_liquipedia_url + "/dota2/Main_Page";
  let liveTourName = "";
  await rp(url)
    .then(function(html) {
      const $ = cheerio.load(html)
      // let tourName = $("table.table-full-width.table-striped.infobox_matches_content .match-filler.valvepremier-highlighted .timer-object-countdown-live", html).parent().parent().parent().parent().parent().find("a[title]");
      // let tourName = $("table.table-full-width.table-striped.infobox_matches_content .match-filler.valvepremier-highlighted .timer-object-countdown-live", html).text();
      let tourDate = $("table.table-full-width.table-striped.infobox_matches_content .match-filler.valvepremier-highlighted .match-countdown", html);
      let tourName = tourDate.next();
      let matchDate = tourDate.first().text().replace(" - ",  " ");
      if (new Date(matchDate).toUTCString() < new Date().toUTCString()) {
        liveTourName = tourName.first().text().trim();
      }
    })
    .catch(function(err) {
      //handle error
      console.error(err)
    });
  return { live : liveTourName };
}

module.exports = {
  getLeagues: getLeagues,
  findURL: findURL,
  liveTournament: liveTournament
};
