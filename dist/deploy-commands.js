"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-unused-vars
const _1 = require(".");
const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const path = require("path");
const commands = [];
const commandsPath = path.join(__dirname, "commands");
let commandFiles;
if (_1.env === "development") {
    commandFiles = fs.readdirSync("./commands");
}
else {
    commandFiles = fs.readdirSync("./dist/commands");
}
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}
const rest = new REST({ version: "9" }).setToken(_1.token);
rest
    .put(Routes.applicationGuildCommands(_1.clientId, _1.guildId), {
    body: commands,
})
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
