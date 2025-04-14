import { Schema, model } from "mongoose";

const msgSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "file"],
      deafault: "text",
    },
  },
  { timestamps: true }
);

export const Message = model("Message", msgSchema);
