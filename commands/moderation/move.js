module.exports = {
    name: 'move',
    description: 'Move a message between text channels',
    aliases: ['mv', 'move-msg'],
    serverOnly: true,
    hasParameter: true,
    usage: '<messageID> <source> <destination>',
    async execute(message, parameters, client) {
        const [ messageID, source, destination ] = parameters;
        
        const sourceChannel = client.channels.cache.find(channel => channel.name === source),
              destinationChannel = client.channels.cache.find(channel => channel.name === destination);

        const sourceMessage = await sourceChannel.messages.fetch(messageID);
        let content = sourceMessage.content;

        if(sourceMessage.author.id !== client.user.id) {
            content = `Originally posted by ${sourceMessage.author}\n\n` + content;
        }
        
        destinationChannel.send(content);
        sourceChannel.messages.delete(sourceMessage);
    }
};
