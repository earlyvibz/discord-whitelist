import { Collection } from "discord.js";
import fs from "node:fs";

const command = (client: any) => {
  client.commands = new Collection();
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file: String) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.data.name, command);
  }
};

export default command;
