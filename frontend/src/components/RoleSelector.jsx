import { useEffect, useState } from "react";
import { getRoleUsers } from "../api";

// shows buttons to switch between user roles for testing
function RoleSelector({ onSelect }) {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    getRoleUsers()
      .then((data) => {
        setUserList(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading users...</p>;
  if (userList.length === 0) return <p style={{ color: "red" }}>Could not load users from backend. Is the server running?</p>;

  function handleRoleClick(user) {
    setActiveId(user._id);
    onSelect(user);
  }

  const activeUser = userList.find((u) => u._id === activeId);

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Select Role</h3>
      <p style={{ color: "#555", fontSize: "13px" }}>
        Selecting a role simulates being that user (sends their ID in the request header).
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        {userList.map((user) => (
          <button
            key={user._id}
            onClick={() => handleRoleClick(user)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: activeId === user._id ? "#333" : "#eee",
              color: activeId === user._id ? "#fff" : "#000",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </button>
        ))}
      </div>
      {activeId && (
        <p style={{ marginTop: "8px", fontSize: "13px", color: "#444" }}>
          Acting as: <strong>{activeUser?.name}</strong> ({activeUser?.role})
        </p>
      )}
    </div>
  );
}

export default RoleSelector;
