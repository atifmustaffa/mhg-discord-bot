const rp = require("request-promise")
const { JSDOM } = require('jsdom')

const liquipediaURL = 'https://liquipedia.net'
const twitchURL = 'https://www.twitch.tv'
const youtubeURL = 'https://www.youtube.com'
const valveColor = '#ffffcc'
const valveColorRGB = 'rgb(255, 255, 204)'

async function getMatches(limit = 20) {
    const subpage = 'dota2'
    return await rp(concatURL(liquipediaURL, subpage, 'Liquipedia:Upcoming_and_ongoing_matches')).then(htmlContent => {
        const jsdomContent = new JSDOM(htmlContent)
        let matchesEL = jsdomContent.window.document.querySelectorAll('div[data-toggle-area-content="1"] table.infobox_matches_content')

        // Format matches into array
        let matches = Array.from(matchesEL).slice(0, limit).map(matchEL => {
            let matchObject = {}
            let teamLeft = {
                name: matchEL.querySelector('tr .team-left').textContent.trim(),
                // icon: matchEL.querySelector('tr .team-left .team-template-image-icon img').src
            }
            let teamRight = {
                name: matchEL.querySelector('tr .team-right').textContent.trim(),
                // icon: matchEL.querySelector('tr .team-right .team-template-image-icon img').src
            }
            // Title
            matchObject.title = teamLeft.name + ' vs ' + teamRight.name

            // Teams
            matchObject.teams = [teamLeft, teamRight]

            // Current score
            matchObject.current_score = matchEL.querySelector('tr .versus div').textContent.trim()

            // Playoff format
            matchObject.playoff_format = matchEL.querySelector('tr .versus div').nextElementSibling.textContent.trim()

            // Date
            matchObject.date =  new Date(
                matchEL
                    .querySelector('tr').nextElementSibling
                    .querySelector('.match-countdown .timer-object').textContent.trim().replace(' - ', ' ')
            )

            // Live
            const isLive = (date) => {
                return new Date(date) < new Date()
            }

            matchObject.live = isLive(matchObject.date)

            // Tournament
            matchObject.tournament = matchEL
                .querySelector('tr').nextElementSibling
                .querySelector('.match-countdown').nextElementSibling.textContent.trim()

            // Valve Tour?
            let color = matchEL.querySelector('tr').style.backgroundColor || jsdomContent.window.getComputedStyle(matchEL.querySelector('tr'), null).backgroundColor
            matchObject.valve_tournament = color === valveColor || color === valveColorRGB

            // Streams
            let streamsEL = Array.from(matchEL.querySelector('tr').nextElementSibling.querySelector('.match-countdown .timer-object').attributes)
                .filter(attr => attr.name.includes('data-stream-'))

            let createStreamURL = (type, name) => {
                switch (type) {
                    case 'twitch':
                        return concatURL(twitchURL, name)

                    case 'youtube':
                        return concatURL(youtubeURL, name)

                    default: return ''
                }
            }

            // Store stream links
            matchObject.streams = streamsEL.map(attr => {
                let type = attr.name.replace('data-stream-', '')
                let name = attr.value
                return {
                    type,
                    name,
                    url: createStreamURL(type, name)
                }
            })
            return matchObject
        })
        return matches
    })
}

async function getTournaments() {
    const subpage = 'dota2'
    return await rp(concatURL(liquipediaURL, subpage, 'Portal:Tournaments')).then(htmlContent => {
        const jsdomContent = new JSDOM(htmlContent)
        let headingsEL = jsdomContent.window.document.querySelectorAll('h3 .mw-headline')
        let tournamentsObject = {}

        // Format each type into object attr
        headingsEL.forEach(headingEL => {
            let tournamentsEL = headingEL.parentElement.nextElementSibling.querySelectorAll('.divRow')
            tournamentsObject[headingEL.id.toLowerCase()] = Array.from(tournamentsEL).map(tourEL => {
                return {
                    name: tourEL.querySelector('.divCell.Tournament').textContent.trim(),
                    tier: tourEL.querySelector('.divCell.Tier a').textContent.trim(),
                    date: tourEL.querySelector('.divCell.Date').textContent.trim(),
                    price: tourEL.querySelector('.divCell.Prize').textContent.trim(),
                    location: tourEL.querySelector('.divCell.Location').textContent.trim(),
                    winner: tourEL.querySelector('.divCell.FirstPlace').textContent.trim()
                }
            })
        })
        return tournamentsObject
    })
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

    const subreddit = ['gamingmemes', 'memes']
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

    let validData = null
    let count = 0

    // Make sure the url is a valid media(an image)
    while(validData === null) {
        if (count >= 25) break
        count++
        let meme = scrapedData[randomNumber(25)].data

        if (isMediaURL(meme.url)) {
            validData = meme
        }
    }

    return validData
}

function concatURL(...args) {
    return args.map(arg => arg.replace(/^(\/+)|(\/+)$/, '')).join('/')
}

function randomNumber(max) {
    const min = 0
    const r = Math.random() * (max - min) + min
    return Math.floor(r)
}

function isMediaURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) !== null)
}

module.exports = {
    getMatches,
    getTournaments,
    getRandomMeme,
}