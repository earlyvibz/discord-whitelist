import { MessageActionRow, MessageButton } from "discord.js";

const btnWallet = ({ wl }: { wl: string }) => {
  return new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(`${wl}`)
        .setLabel("Add your wallet")
        .setStyle("PRIMARY")
    )
    .addComponents(
      new MessageButton()
        .setCustomId(`verify-${wl}`)
        .setLabel("Check submission")
        .setStyle("SECONDARY")
    );
};

export default btnWallet;
