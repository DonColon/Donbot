const Discord = require('discord.js');
const fs = require('fs');

// Load environment variables into process
const dotenv = require('dotenv');
dotenv.config();


// Setup client and register commands, events
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Read in all command files and register the command to client
const commandFolders = fs.readdirSync('./commands');

for(const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    
    for(const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

// Read in all event files and register the event to client
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for(const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Connect to discord server
client.login(process.env.TOKEN);
