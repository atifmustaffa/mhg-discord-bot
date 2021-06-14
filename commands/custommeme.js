module.exports = {
    description: 'Create a custom meme from an image url',
    admin: true,
    handler: (message, args) => {
        if (args.length && args[args.length - 1].substr(0, 4) === "http") {
            let title = args.slice(0, -1).join(' ')
            title = title.charAt(0).toLocaleUpperCase() + title.slice(1)
            message.channel.send(title ? `> ${title}` : '', { files: [args[args.length - 1]] })
            message.delete(2000)
        } else {
            message.channel.send(`Invalid arguments`).then(msg => msg.delete(2000))
        }
    }
}