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

// Get all saved chats
router.get('/getChats', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ timestamp: -1 });
    res.status(200).json(chats);
  } catch (error) {
    console.error('❌ Error retrieving chats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
