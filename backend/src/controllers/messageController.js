
const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID." });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.userId,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const messages = await Message.find({ conversationId })
      .populate("senderId", "username email")
      .sort({ createdAt: 1 })
      .limit(100);

    return res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID." });
    }

    if (!text) {
      return res.status(400).json({ message: "Message cannot be empty." });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        message: "Message cannot exceed 5000 characters.",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.userId,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const message = await Message.create({
      conversationId,
      senderId: req.user.userId,
      text,
    });

    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate(
  "senderId",
  "username email"
    );

    // Notify all connected users who joined this conversation.
    const io = req.app.get("io");

    if (io) {
    io.to(conversationId).emit("newMessage", populatedMessage);
    }

    return res.status(201).json({ message: populatedMessage });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, sendMessage };
