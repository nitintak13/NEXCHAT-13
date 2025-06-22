import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightContainer = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div
      className={`w-full bg-[#1e1d2f] text-white overflow-y-auto px-4 py-6 relative
      ${selectedUser ? "max-md:hidden" : ""}`}
    >
      {/* Profile Info */}
      <div className="flex flex-col items-center gap-2">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="text-center">
          <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            )}
          </h2>
          <p className="text-sm text-gray-300 mt-1">{selectedUser.bio}</p>
        </div>
      </div>

      <hr className="my-6 border-gray-600" />

      {/* Media Gallery */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Shared Media</h3>
        <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1">
          {msgImages.length > 0 ? (
            msgImages.map((url, index) => (
              <img
                key={index}
                src={url}
                onClick={() => window.open(url)}
                className="w-full h-[100px] object-cover rounded-md cursor-pointer hover:scale-105 transition"
                alt={`shared-img-${index}`}
              />
            ))
          ) : (
            <p className="text-xs text-gray-500 col-span-2">
              No images shared yet.
            </p>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-2 text-sm rounded-full shadow hover:scale-105 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default RightContainer;
