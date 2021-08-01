const Discord = require('discord.js');
const fs = require('fs');

// Load environment variables into process
const dotenv = require('dotenv');
dotenv.config();

// Load configuration of the bot
const { prefix } = require('./config.json');

// Read in all command files and fill the collection
const commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for(const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`)
                            .filter(file => file.endsWith('.js'));
    
    for(const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        commands.set(command.name, command);
    }
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

    // Get command by name or search for an alias
    const command = client.commands.get(commandName) || client.commands.find(command => command.aliases.includes(commandName));

    // When no command was found by the name or alias ignore it
    if(!command) return;

    // Check if command was used on a server
    if(command.serverOnly && message.channel.type === 'dm') {
        message.reply(`This command can not be used in DMs`);
        return;
    }

    // Check if command needs parameters and if parameters are specified
    if(command.hasParameter && parameters.length === 0) {
        let helpText = `You didn't specify the required parameters`;

        if(command.usage) {
            helpText += `\nThis is how you use the command: \`${prefix}${command.name} ${command.usage}\``;
        }

        message.reply(helpText);
        return;
    }

	try {
		command.execute(message, parameters);

	} catch(error) {

		message.reply('There was an error executing the command');
        console.error(error);
	}    
});

// Connect to discord server
client.login(process.env.TOKEN);