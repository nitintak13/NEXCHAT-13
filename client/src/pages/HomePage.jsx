import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightContainer from "../components/RightContainer";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#1e1d2f] to-[#2c284d] text-white">
      <div className="max-w-[1400px] mx-auto h-full p-4 sm:p-6">
        <div
          className={`h-full bg-[#1f1b3a] border border-gray-600 rounded-2xl overflow-hidden grid
            ${
              selectedUser
                ? "md:grid-cols-[1fr_1.7fr_1fr]"
                : "md:grid-cols-[1fr_2fr]"
            }
            grid-cols-1 transition-all duration-300`}
        >
          <Sidebar />
          <ChatContainer />
          {selectedUser && <RightContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
