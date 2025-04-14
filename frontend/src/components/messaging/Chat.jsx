import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import conf from "../../config/conf.js";
import ChatBox from "./ChatBox.jsx";
import { useSelector, useDispatch } from "react-redux";
import { addMessages } from "../../features/chat/chatSlice.js";

export default function Chat({ selectedUser, currentUser }) {
  const [input, setInput] = useState(""); // Message text
  const [socket, setSocket] = useState(null); // Manage socket instance
  const dispatch = useDispatch();

  console.log(`selected user :${selectedUser}`);

  if (!selectedUser) {
    console.log(` No selected user :${selectedUser}`);
    return;
  }
  useEffect(() => {
    const newSocket = io(conf.backendUrl); // Ensure backend URL is correct
    setSocket(newSocket);

    if (currentUser._id) {
      newSocket.emit("user-online", currentUser._id);
    } else {
      console.error("No currentId: ", currentUser);
      return;
    }

    newSocket.on("personal-message", (message) => {
      dispatch(addMessages(message));
    });

    return () => {
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, [currentUser]);

  const sendMsg = () => {
    if (!input.trim() || !socket) return;

    if (!currentUser) {
      throw new Error("No currentUser");
    }
    if (!selectedUser) {
      throw new Error("No selected user");
    }

    const newMsg = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      msg: input,
    };

    socket.emit("personal-message", newMsg);

    // Optimistically update the UI
    setInput(""); // Clear input
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{selectedUser.userName}</h2>

      <ChatBox
        currentUser={currentUser}
        selectedUser={selectedUser}
      />

      <div className="flex">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-4/5 p-2 border border-gray-300 rounded text-black"
        />
        <button
          onClick={sendMsg}
          className="w-1/5 ml-2 bg-blue-500 text-black p-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
