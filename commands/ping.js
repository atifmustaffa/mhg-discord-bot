module.exports = {
    description: 'A simple ping and pong reply',
    handler: (message, args) => {
        message.channel.send('Pong!' + (args.length ? ' ' + args.join(' ') : ''))
    }
}