const { Client, Events, GatewayIntentBits } = require('discord.js');
const { retrieveCommands } = require('./command-loader');
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const luka = new Client({ intents: [GatewayIntentBits.Guilds] });

luka.commands = retrieveCommands();

// Command handling, basically the bot waits for an interaction with him (someone uses a "/" command for example)
// and try to falls a command with that name, if it is found, it executes it (since we've already loaded it before) 
luka.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// When the client is ready, run this code (only once).
luka.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
luka.login(token);

