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
const fs_1 = __importDefault(require("fs"));
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
module.exports = {
    data: new __1.SlashCommandBuilder()
        .setName("export")
        .setDescription("Export whitelist as CSV or JSON")
        .addStringOption((option) => option
        .setName("format")
        .setDescription("Format file")
        .setRequired(true)
        .addChoices({
        name: "CSV",
        value: "csv",
    })
        .addChoices({
        name: "JSON",
        value: "json",
    }))
        .addStringOption((option) => option
        .setName("id")
        .setDescription("Get your ID with /infos")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const choice = yield interaction.options.getString("format");
            const wlId = yield interaction.options.getString("id");
            const wl = yield whitelist_1.default.findOne({ _id: wlId });
            const channelId = yield interaction.channelId;
            yield interaction.deferReply();
            if (choice == "json") {
                const arr = [];
                let jsonArr;
                for (const e of wl === null || wl === void 0 ? void 0 : wl.whitelisted) {
                    const obj = {
                        address: e[0],
                    };
                    arr.push(obj);
                }
                jsonArr = JSON.stringify(arr);
                fs_1.default.writeFile(`${wl === null || wl === void 0 ? void 0 : wl.title}.json`, jsonArr, "utf8", function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
                yield __1.client.channels.cache.get(channelId).send({
                    files: [`./${wl === null || wl === void 0 ? void 0 : wl.title}.json`],
                });
                interaction.editReply({ content: "Your JSON file is ready ! ✅" });
                fs_1.default.unlinkSync(`./${wl === null || wl === void 0 ? void 0 : wl.title}.json`);
            }
            else if (choice == "csv") {
                let arr = [];
                for (const e of wl === null || wl === void 0 ? void 0 : wl.whitelisted) {
                    const obj = { address: e[0] };
                    arr.push(obj);
                }
                const csvWriter = createCsvWriter({
                    path: `./${wl === null || wl === void 0 ? void 0 : wl.title}.csv`,
                    header: [{ id: "address", title: "address" }],
                });
                csvWriter
                    .writeRecords(arr)
                    .then(() => console.log("The CSV file was written successfully"));
                yield __1.client.channels.cache.get(channelId).send({
                    files: [`./${wl === null || wl === void 0 ? void 0 : wl.title}.csv`],
                });
                interaction.editReply({ content: "Your CSV file is ready ! ✅" });
                fs_1.default.unlinkSync(`./${wl === null || wl === void 0 ? void 0 : wl.title}.csv`);
            }
        });
    },
};
