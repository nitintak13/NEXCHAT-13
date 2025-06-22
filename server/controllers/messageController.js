import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";
import { pub, redis } from "../lib/redis.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    const unseenMessages = {};
    const promises = filteredUser.map(async (user) => {
      const msgs = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (msgs.length) unseenMessages[user._id] = msgs.length;
    });
    await Promise.all(promises);

    return res.json({ success: true, users: filteredUser, unseenMessages });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const start = Date.now();

    const myId = String(req.user._id);
    const selectedUserId = String(req.params.id);
    const cacheKey = `chat:${myId}:${selectedUserId}`;
    const reverseCacheKey = `chat:${selectedUserId}:${myId}`;

    let cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ success: true, messages: JSON.parse(cached) });
    }

    cached = await redis.get(reverseCacheKey);
    if (cached) {
      return res.json({ success: true, messages: JSON.parse(cached) });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    await redis.set(cacheKey, JSON.stringify(messages), "EX", 60);

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { seen: true }
    );

    return res.json({ success: true, messages });
  } catch (error) {
    console.error(" getMessages error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    return res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, isImportant } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    const messageData = {
      senderId,
      receiverId,
      text,
      image: imageUrl,
      isImportant: !!isImportant,
    };

    if (!isImportant) {
      const twoDays = 2 * 24 * 60 * 60 * 1000;
      messageData.expiresAt = new Date(Date.now() + twoDays);
    }

    const newMessage = await Message.create(messageData);

    await redis.del(`chat:${senderId}:${receiverId}`);
    await redis.del(`chat:${receiverId}:${senderId}`);

    console.log(" Publishing newMessage to Redis");
    await pub.publish(
      "chat_channel",
      JSON.stringify({
        type: "newMessage",
        receiverId,
        newMessage,
      })
    );

    return res.json({ success: true, newMessage });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const undoMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    await Message.findByIdAndDelete(id);
    await redis.del(`chat:${message.senderId}:${message.receiverId}`);
    await redis.del(`chat:${message.receiverId}:${message.senderId}`);

    await pub.publish(
      "chat_channel",
      JSON.stringify({
        type: "messageDeleted",
        messageId: id,
        senderId: message.senderId.toString(),
        receiverId: message.receiverId.toString(),
      })
    );
    return res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
