"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const btnWallet = ({ wl }) => {
    return new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
        .setCustomId(`${wl}`)
        .setLabel("Add your wallet")
        .setStyle("PRIMARY"));
};
exports.default = btnWallet;
