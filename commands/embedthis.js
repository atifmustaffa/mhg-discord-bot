module.exports = {
    description: 'Create an Discord Embed based on a json object',
    admin: true,
    handler: (message, args) => {
        if (args.length) {
        // Remove discord json text styling if used > parse to json
            var embedConfig = JSON.parse(args.join(' ').replace(/^((```)(json)(\s)*)|(```)$/g, ''))
            message.channel.send(embedConfig)
        } else {
            message.channel.send(`Invalid embed attributes`).then(msg => msg.delete(2000))
        }
    }
}