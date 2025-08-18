import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import postRoutes from './routes/postRoutes.js';
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();

app.use(cookieParser());
app.use(express.json());


// CORS configuration to allow all origins and all methods
app.use(cors({
  origin: "https://social-nest-six.vercel.app",  // frontend URL
  // origin: "http://localhost:5173",
  credentials: true, // allow cookies / auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api/posts', postRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { 
  console.log(`🚀 Server running on port ${PORT}`); 
});

export default app;
