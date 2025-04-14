import { Message } from "../model/message.model.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";

export const getSpecificMessages = async (req, res) => {
  try {
    const { senderId, receiverId, page } = req.params;

    if (!senderId || !receiverId || page) {
      throw new ApiError(
        400,
        "no sender or receiver id is received in backend"
      );
    }

    const size = 20
    const skip = page * 20
    const msgs = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size);

    if (!msgs) {
      console.error(`something went wrong in fetching messages : ${msgs}`);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, msgs.reverse(), "messages retrived successfully")
      );
  } catch (error) {
    console.error("unable fetch old messages");
    return res
      .status(500)
      .json(new ApiError(500, "Failed to retrieve messages"));
  }
};
