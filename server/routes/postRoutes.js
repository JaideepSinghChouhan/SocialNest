import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';
import { likePost, unlikePost } from '../controllers/postController.js';
import { commentPost,deleteComment } from '../controllers/commentController.js';
import { getNewsFeed } from '../controllers/postController.js';
import { getExploreFeed } from "../controllers/postController.js";
import {
  createPost,
  getAllPosts,
  deletePost,
  updatePost
} from '../controllers/postController.js';

const router = express.Router();

// Routes
router.get('/', getAllPosts);
router.post('/create', protect, upload.single('image'), createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/unlike', protect, unlikePost);
router.post('/:id/comment', protect, commentPost);
router.delete('/comments/:commentId', protect, deleteComment);
router.get('/newsfeed', protect, getNewsFeed);
router.get("/explore", protect, getExploreFeed);



export default router;
