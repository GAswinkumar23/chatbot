import express from 'express';
import Chat from '../models/Chat.js';

const router = express.Router();

// Save chat session
router.post('/saveChat', async (req, res) => {
  try {
    const { chat } = req.body;
    if (!chat || chat.length === 0) return res.status(400).json({ error: 'Chat data is empty' });

    const newChat = new Chat({ chat });
    await newChat.save();

    res.status(201).json({ message: 'Chat saved successfully' });
  } catch (error) {
    console.error('❌ Error saving chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/// Get all chats in descending order (latest first)
router.get("/getChats", async (req, res) => {
    try {
      const chats = await Chat.find().sort({ createdAt: -1 });
      res.status(200).json(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });  
  router.delete("/deleteChat/:index", async (req, res) => {
    try {
      const { index } = req.params;
      const sessionIndex = parseInt(index, 10);
  
      // Ensure the index is a valid number
      if (isNaN(sessionIndex) || sessionIndex < 0) {
        return res.status(400).json({ error: "Invalid session index" });
      }
  
      // Fetch all chats sorted by creation date (newest first)
      const chats = await Chat.find().sort({ createdAt: -1 });
  
      if (sessionIndex >= chats.length) {
        return res.status(404).json({ error: "Chat not found" });
      }
  
      // Delete the chat corresponding to the session index
      const chatToDelete = chats[sessionIndex];
      if (!chatToDelete || !chatToDelete._id) {
        return res.status(404).json({ error: "Chat not found" });
      }
  
      await Chat.findByIdAndDelete(chatToDelete._id);
  
      return res.status(200).json({ message: "Chat deleted successfully!" });
    } catch (error) {
      console.error("Error deleting chat:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
export default router;
