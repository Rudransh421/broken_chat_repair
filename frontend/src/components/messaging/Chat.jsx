import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Chat({ selectedUser, currentUser }) {
  const [msg, setMsg] = useState([]); // Chat history
  const [input, setInput] = useState(""); // Message text
  const [socket, setSocket] = useState(null); // Manage socket instance

  useEffect(() => {
    const newSocket = io("http://localhost:8000"); // Ensure backend URL is correct
    setSocket(newSocket);

    newSocket.emit("user-online", currentUser._id);

    newSocket.on("personal-message", (message) => {
      setMsg((prevMsg) => [...prevMsg, message]);
    });

    return () => {
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, [selectedUser]);

  const sendMsg = () => {
    if (!input.trim() || !socket) return;

    const newMsg = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      msg: input,
    };

    socket.emit("personal-message", newMsg);

    // Optimistically update the UI
    setMsg((prevMsg) => [...prevMsg, newMsg]);
    setInput(""); // Clear input
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{selectedUser.userName}</h2>
      <div className="border border-gray-300 p-4 h-72 overflow-y-auto mb-4">
        {msg.map((m, index) => (
          <p
            key={index}
            className={`mb-2 ${
              m.senderId === currentUser._id
                ? "text-right text-blue-600"
                : "text-left text-green-500"
            }`}
          >
            {m.msg} {/* ✅ Fixed this from `m.message` to `m.msg` */}
          </p>
        ))}
      </div>
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
