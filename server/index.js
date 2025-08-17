import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import postRoutes from './routes/postRoutes.js';
import cookieParser from "cookie-parser"

const allowedOrigins = [
  "http://localhost:5173",   // Dev frontend
  "https://social-nest-six.vercel.app" // Deployed frontend
];

dotenv.config();
connectDB();

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // important for cookies / JWT
  }));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/profile', profileRoutes); 
app.use('/api/posts', postRoutes);

 
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`); 
});
 
export default app;
