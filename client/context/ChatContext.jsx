import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socket, axios, authUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) setMessages(data.messages);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const sendMessage = async (messageData) => {
    if (!socket || !selectedUser || !authUser) return;
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        const msg = data.newMessage;

        setMessages((prev) => [...prev, msg]);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const undoMessage = async (messageId) => {
    try {
      const { data } = await axios.delete(`/api/messages/undo/${messageId}`);
      if (!data.success) throw new Error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (socket && selectedUser && authUser) {
      socket.emit("join-chat", selectedUser._id);
      setMessages([]);
      getMessages(selectedUser._id);
    }
  }, [socket, selectedUser, authUser]);

  const handleNew = useCallback(
    (newMessage) => {
      const senderId = String(newMessage.senderId);
      const receiverId = String(newMessage.receiverId);
      const myId = String(authUser._id);
      const selectedChatUserId = String(selectedUser?._id);

      const isCurrentChat =
        selectedChatUserId &&
        ((senderId === selectedChatUserId && receiverId === myId) ||
          (receiverId === selectedChatUserId && senderId === myId));

      if (isCurrentChat) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => {});
      } else {
        setUnseenMessages((prevUnseen) => ({
          ...prevUnseen,
          [senderId]: (prevUnseen[senderId] || 0) + 1,
        }));
      }
    },
    [authUser, selectedUser]
  );

  const handleDelete = useCallback(({ messageId }) => {
    console.log("Received messageDeleted:", messageId);
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
  }, []);
  useEffect(() => {
    if (!socket) return;

    socket.on("messageDeleted", handleDelete);
    return () => socket.off("messageDeleted", handleDelete);
  }, [socket, handleDelete]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", handleNew);
    socket.on("messageDeleted", handleDelete);

    return () => {
      socket.off("newMessage", handleNew);
      socket.off("messageDeleted", handleDelete);
    };
  }, [socket, handleNew, handleDelete]);

  useEffect(() => {
    if (socket) getUsers();
  }, [socket]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        unseenMessages,
        setSelectedUser,
        sendMessage,
        undoMessage,
        getUsers,
        getMessages,
        setUnseenMessages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
