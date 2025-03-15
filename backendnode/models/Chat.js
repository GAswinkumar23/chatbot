import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  chat: [
    {
      text: { type: String, required: true },
      sender: { type: String, enum: ['user', 'bot'], required: true },
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
