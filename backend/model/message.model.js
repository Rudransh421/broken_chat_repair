import { Schema, model } from "mongoose";

const msgSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
},{timestamps:true});

export const Message = model("Message", msgSchema);
