module.exports = {
    description: 'A simple ping and pong reply',
    action: (message, args) => {
        message.channel.send('Pong!' + (args.length ? ' ' + args.join(' ') : ''))
    }
}