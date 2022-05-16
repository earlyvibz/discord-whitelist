"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}
const rest = new REST({ version: "9" }).setToken(_1.token);
rest
  .put(Routes.applicationCommands(_1.clientId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
