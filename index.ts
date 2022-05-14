import whitelist from "./database/shema/whitelist";
import whitelisted from "./database/shema/whitelisted";
import command from "./functions/command";
const { Modal, TextInputComponent, showModal } = require("discord-modals");
import dotenv from "dotenv";
import modalReply from "./functions/modalReply";
const mongoose = require("mongoose");
const { Client, Intents } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const discordModals = require("discord-modals");
dotenv.config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const db = process.env.DATABASE;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
import * as solanaWeb3 from "@solana/web3.js";

console.log("ok ready");

discordModals(client);
// Function command from /functions/command
command(client);

client.once("ready", async () => {
  console.log("Ready!");
  try {
    await mongoose.connect(db, {
      keepAlive: true,
    });
  } catch (e) {
    console.log(e);
  }
});

client.on("interactionCreate", async (interaction: any) => {
  const command = client.commands.get(interaction.commandName);

  if (interaction.isCommand()) {
    try {
      await command.execute(interaction);
    } catch (error) {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  } else if (interaction.isButton()) {
    const buttonId = interaction.customId;

    const modal = new Modal() // We create a Modal
      .setCustomId(buttonId)
      .setTitle("add your wallet")
      .addComponents(
        new TextInputComponent() // We create a Text Input Component
          .setCustomId("walletId")
          .setLabel("Your address")
          .setStyle("SHORT") //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
          .setMinLength(42)
          .setMaxLength(44)
          .setPlaceholder("0x0000...")
          .setRequired(true) // If it's required or not
      );

    showModal(modal, {
      client: client, // Client to show the Modal through the Discord API.
      interaction: interaction, // Show the modal with interaction data.
    });
  }
});

client.on("modalSubmit", async (modal: any) => {
  const address: string = modal.getTextInputValue("walletId");
  const regex: RegExp = /^0x[a-fA-F0-9]{40}$/;
  const result: boolean = regex.test(address);
  const username: string = `${modal.user.username}#${modal.user.discriminator}`;
  const modalId: string = modal.customId;
  const userWl = await whitelisted.findOne({ username: username });
  const currentWl = await whitelist.findOne({ _id: modalId });
  const permitted_role = currentWl?.permitted_role;
  const price = currentWl?.price!;
  const blockchain = currentWl?.blockchain!;
  let verifyRole = modal.member._roles.includes(permitted_role);
  let verifyFormatAddress: boolean | undefined;

  if (blockchain === "SOL") {
    try {
      const solAddress = new solanaWeb3.PublicKey(address);
      verifyFormatAddress = solanaWeb3.PublicKey.isOnCurve(solAddress);
    } catch (e) {
      verifyFormatAddress = false;
    }
  } else if (blockchain === "ETH") {
    verifyFormatAddress = result;
  }

  if (userWl?.whitelists.includes(modalId)) {
    modalReply({ content: "You are already registered ! ❌", modal: modal });
  } else if (verifyFormatAddress === false) {
    modalReply({
      content: "Your address is not correctly formatted ! ❌",
      modal: modal,
    });
  } else if (verifyRole === false) {
    modalReply({
      content: `You don't have the right role ! ❌`,
      modal: modal,
    });
  } else {
    if (userWl === null) {
      await new whitelisted({
        address: address,
        username: username,
        date_enter: Date.now(),
        whitelists: modalId,
      }).save();
    } else {
      await whitelisted.updateOne(
        { username: username },
        {
          $addToSet: {
            whitelists: modalId,
          },
        }
      );
    }

    await whitelist.findOneAndUpdate(
      { _id: modalId },
      {
        $push: {
          whitelisted: address,
        },
      },
      { new: true }
    );
    modalReply({
      content: "Congrats ! You're whitelisted ✅",
      modal: modal,
    });
  }
});

client.login(token);

export { token, clientId, guildId, SlashCommandBuilder, client };
