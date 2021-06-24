function convertSnowflake(strId) {
    return strId.replace(/[<@!>]/g, '')
}

function convertToSnowflake(strId) {
    return `<@!${strId}>`
}

function concatURL(...args) {
    return args.map(arg => arg.replace(/^(\/+)|(\/+)$/, '')).join('/')
}

function randomNumber(min = 0, max = 10) {
    const r = Math.random() * (max - min) + min
    return Math.floor(r)
}

function isValidURL(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
    return !!pattern.test(url)
}

function isMediaURL(url) {
    return(isValidURL(url) && url.match(/\.(jpeg|jpg|gif|png)$/) !== null)
}

function log(...args) {
    console.log(new Date().toLocaleString(), "->", ...args)
}

module.exports = {
    convertSnowflake,
    convertToSnowflake,
    concatURL,
    randomNumber,
    isValidURL,
    isMediaURL,
    log
}