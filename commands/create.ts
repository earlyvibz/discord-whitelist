import { SlashCommandBuilder, client } from "..";
import whitelist from "../database/shema/whitelist";
import guild from "../database/shema/guild";
import btnWallet from "../functions/buttonWallet";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Create a new whitelist")
    .addStringOption((option: any) =>
      option
        .setName("title")
        .setDescription("title whitelist")
        .setRequired(true)
    )
    .addStringOption((option: any) =>
      option
        .setName("description")
        .setDescription("Short description of your whitelist")
        .setRequired(true)
    )
    .addStringOption((option: any) =>
      option
        .setName("blockchain")
        .setDescription("Choose a blockchain")
        .setRequired(true)
        .addChoices({
          name: "ETH",
          value: "ETH",
        })
        .addChoices({
          name: "SOL",
          value: "SOL",
        })
    )
    .addNumberOption((option: any) =>
      option
        .setName("price")
        .setDescription("Price for whitelisted")
        .setRequired(true)
    )
    .addChannelOption((option: any) =>
      option
        .setName("channel")
        .setDescription("Channel to insert your embed")
        .setRequired(true)
    )
    .addRoleOption((option: any) =>
      option
        .setName("permitted-role")
        .setDescription("Permitted role for a given whitelist")
        .setRequired(true)
    ),

  async execute(interaction: any) {
    const title: string = await interaction.options.getString("title");
    const desc: string = await interaction.options.getString("description");
    const price: number = await interaction.options.getNumber("price");
    const blockchain: string = await interaction.options.getString(
      "blockchain"
    );
    const permitted_role = await interaction.options.getRole("permitted-role")
      .id;
    const channelId: number = await interaction.options.getChannel("channel")
      .id;
    const serveurId: string = await interaction.member.guild.id;
    const serveurName: string = await interaction.member.guild.name;

    const embed: Object = {
      color: 0x0099ff,
      title: "Submit your wallet",
      description: desc,
      fields: [
        {
          name: "Blockchain",
          value: blockchain,
          inline: true,
        },
        {
          name: "Price",
          value: price.toString(),
          inline: true,
        },
      ],
      author: {
        name: "WhitelistEasy",
        icon_url: "https://i.ibb.co/0QmRrhr/logowl.png",
        url: "https://i.ibb.co/0QmRrhr/logowl.png",
      },
      thumbnail: {
        url: "https://i.ibb.co/0QmRrhr/logowl.png",
      },
    };

    await guild.find({ serveurId: serveurId }).then(async (guildFound) => {
      if (!guildFound.length) {
        await new guild({
          serveur_id: serveurId,
          name: serveurName,
          date_install: Date.now(),
        }).save();

        const wl = await new whitelist({
          serveurId: serveurId,
          title: title,
          blockchain: blockchain,
          price: price,
          description: desc,
          permitted_role: permitted_role,
          date: Date.now(),
        }).save();

        await guild.findOneAndUpdate(
          { serveur_id: serveurId },
          {
            $push: {
              whitelists: wl._id,
            },
          },
          { new: true }
        );

        client.channels.cache.get(channelId).send({
          embeds: [embed],
          components: [btnWallet({ wl: wl?._id.toString() })],
        });
      } else {
        const wl = await new whitelist({
          serveurId: serveurId,
          title: title,
          blockchain: blockchain,
          description: desc,
          price: price,
          permitted_role: permitted_role,
          date: Date.now(),
        }).save();

        await guild.findOneAndUpdate(
          { serveur_id: serveurId },
          {
            $push: {
              whitelists: wl._id,
            },
          },
          { new: true }
        );

        client.channels.cache.get(channelId).send({
          embeds: [embed],
          components: [btnWallet({ wl: wl?._id.toString() })],
        });
      }
    });

    interaction.reply({ content: "Whitelist created ✅" });
  },
};
