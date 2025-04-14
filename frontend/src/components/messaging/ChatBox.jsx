import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import conf from "../../config/conf.js";
import { useSelector, useDispatch } from "react-redux";
import { addMessages, clearMessages } from "../../features/chat/chatSlice.js";

function ChatBox({ currentUser, selectedUser }) {
  const [page, setPage] = useState(0);
  const msg = useSelector((state) => state.messages);
  const [hashMore, setHashMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(clearMessages());
    setPage(0);
    setHashMore(true);
  }, [selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!containerRef.current) return;
        setLoading(true);

        const prevHeight = containerRef.current.scrollHeight;

        const res = await axios.get(
          `${conf.backendUrl}/users/messages/${currentUser._id}/${selectedUser._id}/${page}`
        );
        let m = res.data.data;
        if (m.length !== 0) {
          dispatch(addMessages(res.data.data));
        } else {
          setHashMore(false);
        }
        setTimeout(() => {
          const newHeight = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newHeight - prevHeight;
        }, 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser, page]);

  const handleScroll = () => {
    if (containerRef.current.scrollTop === 0 && hashMore) {
      setPage((prev) => prev + 1);
    }
  };
  return (
    <>
      <div
        className="border border-gray-300 p-4 h-72 overflow-y-auto mb-4"
        onScroll={handleScroll}
        ref={containerRef}
      >
        {loading && (
          <div className="flex justify-center items-center mb-2">
            <div className="w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin" />
          </div>
        )}
        {msg.map((m, index) => (
          <p
            key={index}
            className={`mb-2 ${
              m.senderId === currentUser._id
                ? "text-right bg-blue-600"
                : "text-left bg-green-500"
            }`}
          >
            {m.msg}
          </p>
        ))}
      </div>
    </>
  );
}

export default ChatBox;
