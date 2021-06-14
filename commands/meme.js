const scraper = require("../scraper")

module.exports = {
    description: 'Return a random meme from reddit',
    handler: (message, args) => {
        scraper.getRandomMeme().then((meme) => {
            message.channel.send(`> ${meme.title}`, { files: [meme.url] })
            message.delete(2000)
        })
    }
}