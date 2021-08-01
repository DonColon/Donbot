module.exports = {
    name: 'move',
    description: 'Move a message between text channels',
    aliases: ['mv', 'move-msg'],
    serverOnly: true,
    hasParameter: true,
    usage: '<from> <to> <messageID>',
    execute(message, parameters) {
        message.channel.send('pong');
    }
};
