"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GuildShema = new mongoose_1.Schema({
    serveur_id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date_install: {
        type: Date,
        required: true,
    },
    whitelists: [
        {
            type: Array,
        },
    ],
});
exports.default = (0, mongoose_1.model)("Guild", GuildShema);
