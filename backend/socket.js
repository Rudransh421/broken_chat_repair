import { Server } from "socket.io";
import { Message } from "./model/message.model.js";
import { ApiError } from "./utilities/ApiError.js";


let onlineUsers = new Map();

export function setUpSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("user-online", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online.`);
    });

    socket.on("personal-message", async ({ senderId, receiverId, msg }) => {
      try {


        if (!senderId){
          console.error('Error no senderId :',senderId)
          return;
        }
        const newMessage = await Message.create({
          senderId,
          receiverId,
          msg,
        });

        if(!newMessage){
          throw new ApiError(500,'unable to create and save newMessage')
        }

        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit("personal-message", newMessage);
        }
        socket.emit("message-saved", newMessage);
        console.log(`Message from ${senderId} saved with id ${newMessage._id}`);
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error", { message: "Failed to save message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);

      for (const [userId, socketId] of onlineUsers) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
}
