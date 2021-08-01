module.exports = {
    name: 'help',
    description: 'List all commands or get info about a specific command',
    aliases: ['commands'],
    serverOnly: false,
    hasParameter: false,
    usage: '<commandName>',
    execute(message, parameters) {
        message.channel.send('pong');
    }
};
