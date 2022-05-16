import { model, Schema, Types } from "mongoose";

export interface IGuild {
  serveur_id: Number;
  name: String;
  date_install: Date;
  whitelists: Types.Array<String>;
}

const GuildShema = new Schema<IGuild>({
  serveur_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date_install: {
    type: Date,
    required: true,
  },
  whitelists: [
    {
      type: Array,
    },
  ],
});

export default model<IGuild>("Guild", GuildShema);
