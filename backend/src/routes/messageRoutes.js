
const express = require("express");
const {
  getMessages,
  sendMessage,
} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/:conversationId/messages", getMessages);
router.post("/:conversationId/messages", sendMessage);

module.exports = router;
