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
    const currentYear = new Date().getFullYear()
    const url = dota_liquipedia_url + await findURL()
    await rp(url)
        .then(function(html) {
            const $ = cheerio.load(html)
            //success!
            const name = $("#firstHeading > span", html)[0]
            const leagues = []
            var rows = $("#mw-content-text > div > table.wikitable tr", html)
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
        })
        .catch(function(err) {
            //handle error
            console.error(err)
        })
    return htmlOutput
}

async function liveMatches() {
    const url = dota_liquipedia_url + "/dota2/Liquipedia:Upcoming_and_ongoing_matches"
    let liveMatches = []
    const valveColor = "#ffffcc"

    let checkLive = function(timestring) {
        return new Date(timestring) < new Date()
    }

    await rp(url)
        .then(function(html) {
            const $ = cheerio.load(html)

            let matches = $('div[data-toggle-area-content=1] table.infobox_matches_content', html)

            // Filter for live matches only
            let valveMatches = matches.toArray().filter(function(el) {
                if (checkLive($(el).find('tr').next().find('.match-countdown .timer-object').text().trim().replace(' - ', ' '))) return $(el)
            })

            // Restructure match data into json object
            valveMatches.forEach(function(matchEL) {
                let matchNameEL = $(matchEL).find('tr').first()
                let matchDescEL = $(matchEL).find('tr').next()
                // Object variables
                let name = `${$(matchNameEL).find('.team-left').text().trim()} vs ${$(matchNameEL).find('.team-right').text().trim()}`
                let current_score = `${$(matchNameEL).find('.versus').text().trim()}`
                let timedate = `${new Date($(matchDescEL).find('.match-countdown .timer-object').text().trim().replace(' - ', ' '))}`
                let timestamp = `${new Date($(matchDescEL).find('.match-countdown .timer-object').text().trim().replace(' - ', ' ')).getTime()}`
                let tournament_name = `${$(matchDescEL).find('div a[title]').text().trim()}`
                let is_valve = $(matchEL).find('tr').first().css('background-color') == valveColor
                liveMatches.push({ name, current_score, timedate, timestamp, tournament_name, is_valve })
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
