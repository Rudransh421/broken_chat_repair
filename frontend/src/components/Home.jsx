import React, { useEffect, useState } from "react";

import axios from "axios";

import Logout from "./Logout.jsx";
import UserList from "./UserList.jsx";
import Chat from "./Chat.jsx";

function Home() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    axios
      .get("http://localhost:8000/user/currentuser", { withCredentials: true })
      .then((res) => {
        setCurrentUser(res.data); // Expected to have _id and username
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading user...</p>;
  }

  if (!currentUser) {
    return <p>Please log in to access the chat.</p>;
  }
  return (
    <div className="bg-black">
      <div className="flex gap-8">
        <div className="w-1/3 text-white">
          <UserList onSelectUser={setSelectedUser} />
          <Logout />
        </div>
        <div className="w-2/3 text-white">
          {selectedUser ? (
            <Chat selectedUser={selectedUser} currentUser={currentUser} />
          ) : (
            <p>people in contact</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
