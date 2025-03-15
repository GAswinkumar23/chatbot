import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import chatRoutes from './routes/chatRoutes.js';

// Initialize app
const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chats', chatRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
