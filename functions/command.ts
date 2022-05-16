import { Collection } from "discord.js";
const fs = require("fs");

const path = require("path");

const command = (client: any) => {
  client.commands = new Collection();
  const commandsPath = "../commands";

  const commandFiles = fs.readdirSync("./dist/commands");

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
  }
};

export default command;
