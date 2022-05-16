import { model, Schema, Types } from "mongoose";

export interface IWhitelist {
  serveurId: string;
  title: String;
  description: String;
  blockchain: String;
  price: String;
  date: Date;
  permitted_role: String;
  whitelisted: Types.Array<String>;
}

const WhitelistShema = new Schema<IWhitelist>({
  serveurId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  blockchain: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  permitted_role: {
    type: String,
    required: true,
  },
  whitelisted: [
    {
      type: Array,
    },
  ],
});

export default model<IWhitelist>("Whitelist", WhitelistShema);
