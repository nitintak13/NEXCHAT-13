import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`h-full bg-[#1f1f2e] text-white rounded-r-xl p-4 overflow-y-auto w-full max-w-xs 
      ${selectedUser ? "max-md:hidden" : ""}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">NEXChat</h1>
        <div className="relative group">
          <img
            src={assets.menu_icon}
            alt="Menu"
            className="w-5 h-5 cursor-pointer"
          />
          <div className="absolute right-0 top-2 mt-2 w-32 rounded-md bg-[#2a2a3b] shadow-lg border border-gray-600 text-sm hidden group-hover:block z-50">
            <p
              onClick={() => navigate("/profile")}
              className="p-3 hover:bg-[#3a3a4e] cursor-pointer"
            >
              Edit Profile
            </p>
            <hr className="border-gray-500" />
            <p
              onClick={logout}
              className="p-3 hover:bg-[#3a3a4e] cursor-pointer text-red-400"
            >
              Logout
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-[#2b2b3c] px-3 py-2 rounded-full mb-5">
        <img src={assets.search_icon} alt="Search" className="w-4 h-4" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search users..."
          className="ml-3 bg-transparent outline-none text-sm flex-1 text-white placeholder-gray-400"
        />
      </div>

      {/* User List */}
      <div className="flex flex-col space-y-1">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            className={`flex items-center gap-3 p-3 rounded-md transition-all cursor-pointer hover:bg-[#34344a] ${
              selectedUser?._id === user._id ? "bg-[#34344a]" : ""
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{user.fullName}</p>
              <span
                className={`text-xs ${
                  onlineUsers.includes(user._id)
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </span>
            </div>
            {unseenMessages[user._id] > 0 && (
              <div className="w-5 h-5 text-xs flex items-center justify-center bg-violet-600 rounded-full">
                {unseenMessages[user._id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
