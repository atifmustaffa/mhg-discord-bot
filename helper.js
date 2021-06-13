function convertSnowflake(strId) {
    return strId.replace(/[<@!>]/g, '')
}

function convertToSnowflake(strId) {
    return `<@!${strId}>`
}

function log(...args) {
    console.log(new Date().toLocaleString(), "->", ...args)
}

module.exports = {
    convertSnowflake,
    convertToSnowflake,
    log: log
}