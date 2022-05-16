"use strict";
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
const __1 = require("..");
const whitelist_1 = __importDefault(require("../database/shema/whitelist"));
const guild_1 = __importDefault(require("../database/shema/guild"));
const buttonWallet_1 = __importDefault(require("../functions/buttonWallet"));
module.exports = {
    data: new __1.SlashCommandBuilder()
        .setName("create")
        .setDescription("Create a new whitelist")
        .addStringOption((option) => option
        .setName("title")
        .setDescription("title whitelist")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("description")
        .setDescription("Short description of your whitelist")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("blockchain")
        .setDescription("Choose a blockchain")
        .setRequired(true)
        .addChoices({
        name: "ETH",
        value: "ETH",
    })
        .addChoices({
        name: "SOL",
        value: "SOL",
    }))
        .addNumberOption((option) => option
        .setName("price")
        .setDescription("Price for whitelisted")
        .setRequired(true))
        .addChannelOption((option) => option
        .setName("channel")
        .setDescription("Channel to insert your embed")
        .setRequired(true))
        .addRoleOption((option) => option
        .setName("permitted-role")
        .setDescription("Permitted role for a given whitelist")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = yield interaction.options.getString("title");
            const desc = yield interaction.options.getString("description");
            const price = yield interaction.options.getNumber("price");
            const blockchain = yield interaction.options.getString("blockchain");
            const permitted_role = yield interaction.options.getRole("permitted-role")
                .id;
            const channelId = yield interaction.options.getChannel("channel")
                .id;
            const serveurId = yield interaction.member.guild.id;
            const serveurName = yield interaction.member.guild.name;
            const embed = {
                color: 0x0099ff,
                title: "Submit your wallet",
                description: desc,
                fields: [
                    {
                        name: "Blockchain",
                        value: blockchain,
                        inline: true,
                    },
                    {
                        name: "Price",
                        value: price.toString(),
                        inline: true,
                    },
                ],
                author: {
                    name: "WhitelistEasy",
                    icon_url: "https://i.ibb.co/0QmRrhr/logowl.png",
                    url: "https://i.ibb.co/0QmRrhr/logowl.png",
                },
                thumbnail: {
                    url: "https://i.ibb.co/0QmRrhr/logowl.png",
                },
            };
            yield guild_1.default.find({ serveurId: serveurId }).then((guildFound) => __awaiter(this, void 0, void 0, function* () {
                if (!guildFound.length) {
                    yield new guild_1.default({
                        serveur_id: serveurId,
                        name: serveurName,
                        date_install: Date.now(),
                    }).save();
                    const wl = yield new whitelist_1.default({
                        title: title,
                        blockchain: blockchain,
                        price: price,
                        description: desc,
                        permitted_role: permitted_role,
                        date: Date.now(),
                    }).save();
                    yield guild_1.default.findOneAndUpdate({ serveur_id: serveurId }, {
                        $push: {
                            whitelists: wl._id,
                        },
                    }, { new: true });
                    __1.client.channels.cache.get(channelId).send({
                        embeds: [embed],
                        components: [(0, buttonWallet_1.default)({ wl: wl === null || wl === void 0 ? void 0 : wl._id.toString() })],
                    });
                }
                else {
                    const wl = yield new whitelist_1.default({
                        title: title,
                        blockchain: blockchain,
                        description: desc,
                        price: price,
                        permitted_role: permitted_role,
                        date: Date.now(),
                    }).save();
                    yield guild_1.default.findOneAndUpdate({ serveur_id: serveurId }, {
                        $push: {
                            whitelists: wl._id,
                        },
                    }, { new: true });
                    __1.client.channels.cache.get(channelId).send({
                        embeds: [embed],
                        components: [(0, buttonWallet_1.default)({ wl: wl === null || wl === void 0 ? void 0 : wl._id.toString() })],
                    });
                }
            }));
            interaction.reply({ content: "Whitelist created ✅" });
        });
    },
};
