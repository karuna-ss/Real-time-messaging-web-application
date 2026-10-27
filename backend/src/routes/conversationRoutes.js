
const express = require("express");

const {
  createConversation,
  getConversations,
} = require("../controllers/conversationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createConversation);
router.get("/", getConversations);

module.exports = router;
