import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { followUser, unfollowUser } from '../controllers/userController.js';
import { searchUsers } from "../controllers/userController.js";
import { getUserByUsername } from '../controllers/userController.js';


const router = express.Router();


router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);
router.get("/search", protect, searchUsers); // or no `protect` if public
router.get('/username/:username', protect, getUserByUsername); // Get user by username

router.get('/', (req, res) => {
  res.json({ message: 'User route works!' });
});

export default router;
