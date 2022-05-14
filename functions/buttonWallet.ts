import { MessageActionRow, MessageButton } from "discord.js";

const btnWallet = ({ wl }: { wl: string }) => {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`${wl}`)
      .setLabel("Add your wallet")
      .setStyle("PRIMARY")
  );
};

export default btnWallet;
