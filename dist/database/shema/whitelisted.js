"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    date_enter: {
        type: Date,
        required: true,
    },
    whitelists: {
        type: Array,
    },
});
exports.default = (0, mongoose_1.model)("Whitelisted", shema);
