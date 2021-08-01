const Discord = require('discord.js');

// Load environment variables into process
const dotenv = require('dotenv');
dotenv.config();

// Load configuration of the bot
const { prefix } = require('./config.json');

// Read all command files and fill the collection
const fs = require('fs');

const commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands')
                       .filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

// Setup client
const client = new Discord.Client();
client.commands = commands;

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

    // When the bot doesn't have a command file for the command ignore it
    if(!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

	try {
		command.execute(message, parameters);

	} catch (error) {

		message.reply('There was an error executing the command');
        console.error(error);
	}    
});

// Connect to discord server
client.login(process.env.TOKEN);