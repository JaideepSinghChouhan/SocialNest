import express from 'express';
import { registerUser, loginUser, refreshAccessToken } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);

router.get('/protected', protect, (req, res) => {
  res.json({ message: 'You have access!', user: req.user });
});

export default router;
