const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { retrieveCommandsInJSON } = require('./command-loader');
require('dotenv').config();
const lukaId = process.env.LUKA_ID;
const serverId = process.env.SERVER_ID;
const token = process.env.DISCORD_TOKEN;

const commands = retrieveCommandsInJSON();

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(lukaId, serverId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();