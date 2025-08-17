import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import postRoutes from './routes/postRoutes.js';
import cookieParser from "cookie-parser"


dotenv.config();
connectDB();
const app = express();

const allowedOrigins = [
  "https://social-nest-six.vercel.app", // Deployed frontend
  "http://localhost:5173",              // Dev frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Important for cookies
  })
);

app.use(cookieParser());

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
