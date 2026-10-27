
const mongoose = require("mongoose");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.userId;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    if (userId === currentUserId) {
      return res.status(400).json({
        message: "You cannot start a conversation with yourself.",
      });
    }

    const otherUser = await User.findById(userId).select("_id");

    if (!otherUser) {
      return res.status(404).json({ message: "User not found." });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, userId], $size: 2 },
    }).populate("participants", "username email");

    if (!conversation) {
      try {
        conversation = await Conversation.create({
          participants: [currentUserId, userId],
        });
      } catch (error) {
        // Another request may have created the same conversation.
        if (error.code !== 11000) throw error;

        conversation = await Conversation.findOne({
          participants: { $all: [currentUserId, userId], $size: 2 },
        });
      }

      if (conversation) {
        await conversation.populate("participants", "username email");
      }
    }

    return res.status(200).json({ conversation });
  } catch (error) {
    console.error("Create conversation error:", error.message);
    return res.status(500).json({
      message: "Unable to create conversation.",
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.userId,
    })
      .populate("participants", "username email")
      .populate({
        path: "lastMessage",
        select: "text senderId createdAt",
      })
      .sort({ updatedAt: -1 });

    return res.json({ conversations });
  } catch (error) {
    console.error("Get conversations error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch conversations.",
    });
  }
};

module.exports = {
  createConversation,
  getConversations,
};
