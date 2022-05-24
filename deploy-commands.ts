// eslint-disable-next-line no-unused-vars
import { token, clientId, guildId, env } from ".";
const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const path = require("path");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
let commandFiles: any;

if (env === "development") {
  commandFiles = fs.readdirSync("./commands");
} else {
  commandFiles = fs.readdirSync("./dist/commands");
}

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

if (env === "production") {
  rest
    .put(Routes.applicationCommands(clientId), {
      body: commands,
    })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
} else {
  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
}
