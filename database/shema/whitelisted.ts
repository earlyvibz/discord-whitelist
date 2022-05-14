import { model, Schema, Types } from "mongoose";

export interface IWhitelisted {
  username: string;
  address: String;
  whitelists: Types.Array<String>;
}

const shema = new Schema({
  username: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date_enter: {
    type: Date,
    required: true,
  },
  whitelists: {
    type: Array,
  },
});

export default model<IWhitelisted>("Whitelisted", shema);
