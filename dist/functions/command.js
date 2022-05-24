"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../");
const fs = require("fs");
const path = require("path");
const command = (client) => {
    client.commands = new discord_js_1.Collection();
    const commandsPath = "../commands";
    let commandFiles;
    if (__1.env === "development") {
        commandFiles = fs.readdirSync("./commands");
    }
    else {
        commandFiles = fs.readdirSync("./dist/commands");
    }
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command);
    }
};
exports.default = command;
