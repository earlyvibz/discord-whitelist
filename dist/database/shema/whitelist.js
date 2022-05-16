"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WhitelistShema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    blockchain: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: new Date(),
    },
    permitted_role: {
        type: String,
        required: true,
    },
    whitelisted: [
        {
            type: Array,
        },
    ],
});
exports.default = (0, mongoose_1.model)("Whitelist", WhitelistShema);
