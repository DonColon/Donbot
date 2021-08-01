// Load environment variables into process
const dotenv = require('dotenv');
dotenv.config();

// Load configuration of the bot
const { prefix } = require('./config.json');

// Setup client
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Donbot is online');
});

client.on('message', message => {
    // When message starts not with the command prefix ignore it
    if(!message.content.startsWith(prefix)) return;

    // When message is from a bot ignore it
    if(message.author.bot) return;

    // Filter out command parameters and name from message
    const parameters = message.content.slice(prefix.length).trim().split(/ +/),
          commandName = parameters.shift().toLowerCase();

	if (commandName === 'ping') {
		message.channel.send('pong');
	}
});

// Connect to discord server
client.login(process.env.TOKEN);