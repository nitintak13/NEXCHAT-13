import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utlis";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    setMessages,
    selectedUser,
    users,
    setSelectedUser,
    sendMessage,
    getMessages,
    undoMessage,
  } = useContext(ChatContext);

  useEffect(() => {
    const updatedUser = users.find((u) => u._id === selectedUser?._id);
    if (
      updatedUser &&
      JSON.stringify(updatedUser) !== JSON.stringify(selectedUser)
    ) {
      setSelectedUser(updatedUser);
    }
  }, [users]);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");

  const [undoVisible, setUndoVisible] = useState({});

  const scrollEnd = useRef();
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;

    await sendMessage({ text: input.trim() });
    setInput("");
  };
  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.senderId !== authUser._id) return;

      const age = Date.now() - new Date(msg.createdAt).getTime();
        if (age < 10000 && undoVisible[msg._id] === undefined) {
        setUndoVisible((u) => ({ ...u, [msg._id]: true }));

        setTimeout(
          () =>
            setUndoVisible((u) => ({
              ...u,
              [msg._id]: false,
            })),
         
          10000 - age
        );
      }
    });
  }, [messages, authUser._id, undoVisible]);
 
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      setMessages([]);
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative bg-[#1f1f2e]">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="arrow"
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img
          src={assets.help_icon}
          alt="help"
          className="max-md:hidden max-w-5 cursor-pointer"
        />
      </div>

      {/* Chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                className={`max-w-[230px] rounded-lg mb-8 border border-gray-700 ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
                src={msg.image}
                alt=""
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            {msg.senderId === authUser._id && undoVisible[msg._id] && (
              <button
                onClick={() => {
                  
                  setMessages((prev) => prev.filter((m) => m._id !== msg._id));
                  undoMessage(msg._id); 
                }}
                className="text-xs text-red-400 underline ml-2"
              >
                Undo
              </button>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom area */}
      <div className=" absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="send a message"
            className="flex-1 text-sm p-2 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="logo" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
