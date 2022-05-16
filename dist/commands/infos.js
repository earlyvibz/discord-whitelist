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
const discord_js_1 = require("discord.js");
module.exports = {
    data: new __1.SlashCommandBuilder()
        .setName("infos")
        .setDescription("Informations whitelist"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const wl = yield whitelist_1.default.find();
            const wlEmbed = new discord_js_1.MessageEmbed().setDescription("Info whitelist");
            const channelId = yield interaction.channelId;
            wl.forEach((element) => {
                return wlEmbed.addField(`${element.title}`, `Id : ${element._id}`, true);
            });
            __1.client.channels.cache.get(channelId).send({ embeds: [wlEmbed] });
            interaction.reply({ content: "Informations :" });
        });
    },
};
