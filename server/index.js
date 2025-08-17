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

app.use(cors(
  {
    origin: "https://social-nest-six.vercel.app",
    credentials: true,
  }
));

// Allow both local dev & deployed frontend
// const allowedOrigins = [
//   "http://localhost:5173",      // Vite local frontend
//   "https://social-nest-six.vercel.app", // Deployed frontend
//   "https://social-nest-2nns.vercel.app"
// ];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// Handle preflight requests
// app.options(/.*/, cors({
//   origin: allowedOrigins,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api/posts', postRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { 
  console.log(`🚀 Server running on port ${PORT}`); 
});

export default app;
