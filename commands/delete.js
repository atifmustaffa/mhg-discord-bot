module.exports = {
    description: 'Bulk delete recently sent messages in a channel',
    handler: (message, args) => {
        message.channel
            .bulkDelete(args[0] || 2)
            .then((messages) => {
                message.channel.send(`Bulk deleted ${messages.size} messages`).then(msg => msg.delete(2000))
            })
            .catch(console.error)
    }
}