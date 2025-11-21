import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index'; // ПРАВИЛЬНЫЙ ИМПОРТ

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes); // ПОДКЛЮЧАЕМ ROUTES

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service' });
});

app.listen(port, () => {
  console.log(`Auth service running on port ${port}`);
});