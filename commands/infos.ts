import { SlashCommandBuilder, client } from "..";
import whitelist from "../database/shema/whitelist";
import { MessageEmbed } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("infos")
    .setDescription("Informations whitelist"),

  async execute(interaction: any) {
    const wl = await whitelist.find();
    const wlEmbed = new MessageEmbed().setDescription("Info whitelist");
    const channelId = await interaction.channelId;

    try {
      wl.forEach((element) => {
        return wlEmbed.addField(
          `${element.title}`,
          `Id : ${element._id}`,
          true
        );
      });

      client.channels.cache.get(channelId).send({ embeds: [wlEmbed] });
      interaction.reply({ content: "Informations :" });
    } catch (e) {
      console.log(e);
    }
  },
};
