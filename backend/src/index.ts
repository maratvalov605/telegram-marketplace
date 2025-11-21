import express from 'express';
import cors from 'cors';
import { telegramAuth } from './middleware/authMiddleware';
import { getProfile, updateTradeName } from './controllers/userController';

const app = express();
app.use(cors());
app.use(express.json());

// Auth route (для Mini App)
app.post('/auth/telegram', telegramAuth, (req, res) => {
  res.status(200).json({ success: true });
});

// Protected routes
app.get('/users/me', telegramAuth, getProfile);
app.patch('/users/me', telegramAuth, updateTradeName);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});