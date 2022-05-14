import { SlashCommandBuilder, client } from "..";
import whitelist from "../database/shema/whitelist";
import fs from "fs";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

interface Obj {
  address: string;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("export")
    .setDescription("Export whitelist as CSV or JSON")
    .addStringOption((option: any) =>
      option
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
        })
    )
    .addStringOption((option: any) =>
      option
        .setName("id")
        .setDescription("Get your ID with /infos")
        .setRequired(true)
    ),

  async execute(interaction: any) {
    const choice: string = await interaction.options.getString("format");
    const wlId: string = await interaction.options.getString("id");
    const wl = await whitelist.findOne({ _id: wlId });
    const channelId = await interaction.channelId;

    await interaction.deferReply();

    if (choice == "json") {
      const arr: Object[] = [];
      let jsonArr;

      for (const e of wl?.whitelisted!) {
        const obj = {
          address: e[0],
        };
        arr.push(obj);
      }

      jsonArr = JSON.stringify(arr);

      fs.writeFile(`${wl?.title}.json`, jsonArr, "utf8", function (err) {
        if (err) {
          return console.log(err);
        }
      });

      await client.channels.cache.get(channelId).send({
        files: [`./${wl?.title}.json`],
      });

      interaction.editReply({ content: "Your JSON file is ready ! ✅" });

      fs.unlinkSync(`./${wl?.title}.json`);
    } else if (choice == "csv") {
      let arr: Object[] = [];

      for (const e of wl?.whitelisted!) {
        const obj: Obj = { address: e[0] };
        arr.push(obj);
      }

      const csvWriter = createCsvWriter({
        path: `./${wl?.title}.csv`,
        header: [{ id: "address", title: "address" }],
      });

      csvWriter
        .writeRecords(arr)
        .then(() => console.log("The CSV file was written successfully"));

      await client.channels.cache.get(channelId).send({
        files: [`./${wl?.title}.csv`],
      });

      interaction.editReply({ content: "Your CSV file is ready ! ✅" });
      fs.unlinkSync(`./${wl?.title}.csv`);
    }
  },
};
