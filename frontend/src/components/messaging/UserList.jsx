import { useState, useEffect } from "react";
import axios from "axios";

export default function UserList({ onSelectUser, currentUser }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/user/getallusers", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      });
  }, []);

  return (
    <div className="p-4 border border-black rounded">
      <h2 className="text-lg font-semibold mb-2">Select a User</h2>

      {error && <p className="text-red-500">{error}</p>}

      {users.length === 0 && !error ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            onClick={() => onSelectUser(user)}
            className="cursor-pointer p-2 rounded text-white "
          >
            {currentUser._id === user._id ? "You" : user.userName}
          </div>
        ))
      )}
    </div>
  );
}
