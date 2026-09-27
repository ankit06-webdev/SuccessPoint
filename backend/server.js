import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config({ path: './config/.env' });

connectDB();

const app = express();

const frontendUrl = process.env.FRONTEND_URL || 'https://success-point-theta.vercel.app';
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', frontendUrl];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());



app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/notice', noticeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payment', paymentRoutes);


app.get('/', (req, res) => {
  res.send('Success Point!');
});
const PORT = process.env.PORT;

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: 'Server Error',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});