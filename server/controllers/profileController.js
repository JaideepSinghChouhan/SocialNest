import User from '../models/User.js';


// Get logged-in user profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('posts', 'caption image createdAt')     // Optional: when Post model is added
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

export const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password")
      .populate("posts", "caption image createdAt")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profile", error: err.message });
  }
};
// Update profile (username, bio, avatar)
export const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const { bio, avatar, coverImage } = req.body;

    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (coverImage !== undefined) user.coverImage = coverImage;

    await user.save();

    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// controllers/userController.js
export const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });  

    const imageUrl = req.file.path || req.file.secure_url;

    if (!imageUrl) {
      return res.status(400).json({ message: 'File uploaded but no path or URL found', file: req.file });
    }

    user.avatar = imageUrl;
    await user.save();

    res.status(200).json({ message: "Avatar updated", user });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};
export const uploadCover = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });  

    const imageUrl = req.file.path || req.file.secure_url;

    if (!imageUrl) {
      return res.status(400).json({ message: 'File uploaded but no path or URL found', file: req.file });
    }

    user.coverImage = imageUrl; 
    await user.save();

    res.status(200).json({ message: "Avatar updated", user });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

export const editProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.username = req.body.username || user.username;
  user.bio = req.body.bio || user.bio;
  user.avatar = req.body.avatar || user.avatar;
  user.coverImage = req.body.coverImage || user.coverImage;

  const updatedUser = await user.save();
  res.json(updatedUser);
};