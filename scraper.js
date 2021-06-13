const rp = require("request-promise")
const cheerio = require("cheerio")
const dota_liquipedia_url = "https://liquipedia.net"

async function findURL() {
    const url = dota_liquipedia_url + "/dota2/Main_Page"
    let foundURL = ""
    await rp(url)
        .then(function(html) {
            const $ = cheerio.load(html)
            foundURL = $("#mw-content-text > div > div:nth-child(3) > div.col-xl-6.col-md-7 > div:nth-child(1) > div.panel-body > div:nth-child(3) > a:nth-child(3)", html).attr("href")
        })
        .catch(function(err) {
            //handle error
            console.error(err)
        })
    return foundURL
}

async function getLeagues() {
    let htmlOutput
    // console.log(await findURL())
    const currentYear = new Date().getFullYear()
    const url = dota_liquipedia_url + await findURL()
    await rp(url)
        .then(function(html) {
            const $ = cheerio.load(html)
            //success!
            // console.log(html);
            const name = $("#firstHeading > span", html)[0]
            const leagues = []
            var rows = $("#mw-content-text > div > table.wikitable tr", html)
            // console.log(rows)
            const header = []

            // find last text element
            let lastChild = function(el) {
                if (el.children == null) return el
                return lastChild(el.children[0])
            }

            for (let i = 0; i < rows.length; i++) {
                let count = 0
                let column = {}

                for (let j = 0; j < rows[i].children.length; j++) {
                    if (rows[i].children[j].name == "th") {
                        header.push(lastChild(rows[i].children[j]).data.trim().replace(/\s+/g, '_').toLowerCase())
                    }
                    else if (rows[i].children[j].name == "td") {
                        column[header[count]] = lastChild(rows[i].children[j]).data.trim()
                        count++
                    }
                }

                if (i > 0) leagues.push(column) // Exclude header
            }

            // htmlOutput = {"noo": "test"};
            htmlOutput = {
                "name": name.children[0].data.trim().replace(": Schedule", ""),
                "url": url,
                "leagues": leagues
            }
            // console.log(htmlOutput)
        })
        .catch(function(err) {
            //handle error
            console.error(err)
        })
    return htmlOutput
}

async function liveMatches() {
    // const url = dota_liquipedia_url + "/dota2/Main_Page";
    const url = dota_liquipedia_url + "/dota2/Liquipedia:Upcoming_and_ongoing_matches"
    let liveMatches = []
    const valveColor = "#ffffcc"

    let checkLive = function(timestring) {
        return new Date(timestring) < new Date()
    }

    await rp(url)
        .then(function(html) {
            const $ = cheerio.load(html)
            // let tourName = $("table.table-full-width.table-striped.infobox_matches_content .match-filler.valvepremier-highlighted .timer-object-countdown-live", html).parent().parent().parent().parent().parent().find("a[title]");
            // let tourName = $("table.table-full-width.table-striped.infobox_matches_content .match-filler.valvepremier-highlighted .timer-object-countdown-live", html).text();
            // let tourDate = $("table.table-full-width.table-striped.infobox_matches_content .match-filler.valvepremier-highlighted .match-countdown", html);

            let matches = $('div[data-toggle-area-content=1] table.infobox_matches_content', html)

            let valveMatches = matches.toArray().filter(function(el) {
                if ($(el).find('tr').first().css('background-color') == valveColor && checkLive($(el).find('tr').next().find('.match-countdown .timer-object').text().trim().replace(' - ', ' '))) return $(el)
            })

            // console.log(valveMatches.length)
            valveMatches.forEach(function(matchEL) {
                let matchNameEL = $(matchEL).find('tr').first()
                let matchDescEL = $(matchEL).find('tr').next()
                let match_name = `${$(matchNameEL).find('.team-left').text().trim()} vs ${$(matchNameEL).find('.team-right').text().trim()}`
                let current_score = `${$(matchNameEL).find('.versus').text().trim()}`
                let match_timedate = `${new Date($(matchDescEL).find('.match-countdown .timer-object').text().trim().replace(' - ', ' '))}`
                let match_timestamp = `${new Date($(matchDescEL).find('.match-countdown .timer-object').text().trim().replace(' - ', ' ')).getTime()}`
                let tournament_name = `${$(matchDescEL).find('div a[title]').text().trim()}`
                liveMatches.push({ match_name, current_score, match_timedate, match_timestamp, tournament_name })
            })
        })
        .catch(function(err) {
            //handle error
            console.error(err)
        })
    return { matches: liveMatches }
}

async function getRandomMeme() {
    const RedditScraper = require('reddit-scraper')

    let redditScraper
    let scrapedData

    // script
    const redditScraperOptions = {
        AppId: process.env.REDDIT_ID,
        AppSecret: process.env.REDDIT_SECRET,
    }

    const subreddit = ['gamingmemes', 'dankmemes']
    const requestOptions = {
        Pages: 1,
        Records: 25,
        SubReddit: subreddit[randomNumber(subreddit.length)],
        SortType: 'hot',
    }

    try {
        redditScraper = new RedditScraper.RedditScraper(redditScraperOptions)
        scrapedData = await redditScraper.scrapeData(requestOptions)
    // console.log(scrapedData)
    } catch (error) {
        console.error(error)
    }

    return scrapedData[randomNumber(25)].data
}

function randomNumber(max) {
    const min = 0
    const r = Math.random() * (max - min) + min
    return Math.floor(r)
}

module.exports = {
    getLeagues: getLeagues,
    findURL: findURL,
    liveMatches: liveMatches,
    getRandomMeme
}
