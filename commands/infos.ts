import { SlashCommandBuilder, client } from "..";
import guild from "../database/shema/guild";
import whitelist from "../database/shema/whitelist";
import { MessageEmbed } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("infos")
    .setDescription("Informations whitelist"),

  async execute(interaction: any) {
    const serverId: string = await interaction.member.guild.id;
    const currentWl = await whitelist.find({ serverId: serverId });
    const wlEmbed = new MessageEmbed().setDescription("Info whitelist");
    const channelId = await interaction.channelId;

    try {
      for (const wl of currentWl) {
        return wlEmbed.addField(`${wl?.title}`, `Id : ${wl._id}`, true);
      }

      client.channels.cache.get(channelId).send({ embeds: [wlEmbed] });
      interaction.reply({ content: "Informations :" });
    } catch (e) {
      console.log(e);
    }
  },
};
