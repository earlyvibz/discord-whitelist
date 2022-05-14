const modalReply = async ({
  content,
  modal,
}: {
  content: string;
  modal: any;
}) => {
  await modal.deferReply({ ephemeral: true });
  modal.followUp({
    content: content,
    ephemeral: true,
  });
};

export default modalReply;