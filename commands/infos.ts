import { SlashCommandBuilder, client } from "..";
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

    if (currentWl.length === 0) {
      interaction.reply({
        content: "There are no registered whitelists.",
        ephemeral: true,
      });
    } else {
      try {
        for (const wl of currentWl) {
          wlEmbed.addField(`${wl?.title}`, `Id : ${wl._id}`, true);
        }

        client.channels.cache.get(channelId).send({ embeds: [wlEmbed] });
        interaction.reply({ content: "Informations :" });
      } catch (e) {
        console.log(e);
      }
    }
  },
};
