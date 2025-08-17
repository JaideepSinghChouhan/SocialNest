import express from 'express';
import { getMyProfile, updateMyProfile, getUserProfileById, uploadAvatar, uploadCover, editProfile } from '../controllers/profileController.js';

import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/upload-cover', protect, upload.single('coverImage'), uploadCover);


// Protected routes
router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get("/:userId", protect, getUserProfileById);
router.put('/editProfile', protect, editProfile);

export default router;
 