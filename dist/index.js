"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.client = exports.SlashCommandBuilder = exports.guildId = exports.clientId = exports.token = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const solanaWeb3 = __importStar(require("@solana/web3.js"));
const whitelist_1 = __importDefault(require("./database/shema/whitelist"));
const whitelisted_1 = __importDefault(require("./database/shema/whitelisted"));
const command_1 = __importDefault(require("./functions/command"));
const modalReply_1 = __importDefault(require("./functions/modalReply"));
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const mongoose = require("mongoose");
const { Client, Intents } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
exports.SlashCommandBuilder = SlashCommandBuilder;
const discordModals = require("discord-modals");
dotenv_1.default.config();
const env = process.env.NODE_ENV;
exports.env = env;
const token = process.env.DISCORD_TOKEN;
exports.token = token;
const clientId = process.env.CLIENT_ID;
exports.clientId = clientId;
const guildId = process.env.GUILD_ID;
exports.guildId = guildId;
const db = process.env.DATABASE;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
exports.client = client;
console.log(env);
discordModals(client);
// Function command from /functions/command
(0, command_1.default)(client);
client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Ready!");
    try {
        yield mongoose.connect(db, {
            keepAlive: true,
        });
        console.log("mongo ok");
    }
    catch (e) {
        console.log(e);
    }
}));
client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const command = client.commands.get(interaction.commandName);
    if (interaction.isCommand()) {
        try {
            yield command.execute(interaction);
        }
        catch (error) {
            yield interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
    else if (interaction.isButton()) {
        const buttonId = interaction.customId;
        const modal = new Modal() // We create a Modal
            .setCustomId(buttonId)
            .setTitle("add your wallet")
            .addComponents(new TextInputComponent() // We create a Text Input Component
            .setCustomId("walletId")
            .setLabel("Your address")
            .setStyle("SHORT") // IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
            .setMinLength(42)
            .setMaxLength(44)
            .setPlaceholder("0x0000...")
            .setRequired(true) // If it's required or not
        );
        showModal(modal, {
            client,
            interaction, // Show the modal with interaction data.
        });
    }
}));
client.on("modalSubmit", (modal) => __awaiter(void 0, void 0, void 0, function* () {
    const address = modal.getTextInputValue("walletId");
    const regex = /^0x[a-fA-F0-9]{40}$/;
    const result = regex.test(address);
    const username = `${modal.user.username}#${modal.user.discriminator}`;
    const modalId = modal.customId;
    const userWl = yield whitelisted_1.default.findOne({ username });
    const currentWl = yield whitelist_1.default.findOne({ _id: modalId });
    const permittedRole = currentWl === null || currentWl === void 0 ? void 0 : currentWl.permitted_role;
    const blockchain = currentWl === null || currentWl === void 0 ? void 0 : currentWl.blockchain;
    const verifyRole = modal.member._roles.includes(permittedRole);
    let verifyFormatAddress;
    if (blockchain === "SOL") {
        try {
            const solAddress = new solanaWeb3.PublicKey(address);
            verifyFormatAddress = solanaWeb3.PublicKey.isOnCurve(solAddress);
        }
        catch (e) {
            verifyFormatAddress = false;
        }
    }
    else if (blockchain === "ETH") {
        verifyFormatAddress = result;
    }
    if (userWl === null || userWl === void 0 ? void 0 : userWl.whitelists.includes(modalId)) {
        (0, modalReply_1.default)({ content: "You are already registered ! ❌", modal });
    }
    else if (verifyFormatAddress === false) {
        (0, modalReply_1.default)({
            content: "Your address is not correctly formatted ! ❌",
            modal,
        });
    }
    else if (verifyRole === false) {
        (0, modalReply_1.default)({
            content: "You don't have the right role ! ❌",
            modal,
        });
    }
    else {
        if (userWl === null) {
            yield new whitelisted_1.default({
                address,
                username,
                date_enter: Date.now(),
                whitelists: modalId,
            }).save();
        }
        else {
            yield whitelisted_1.default.updateOne({ username }, {
                $addToSet: {
                    whitelists: modalId,
                },
            });
        }
        yield whitelist_1.default.findOneAndUpdate({ _id: modalId }, {
            $push: {
                whitelisted: address,
            },
        }, { new: true });
        (0, modalReply_1.default)({
            content: "Congrats ! You're whitelisted ✅",
            modal,
        });
    }
}));
client.login(token);
