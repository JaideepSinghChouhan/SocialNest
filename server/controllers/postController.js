import Post from '../models/Post.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';


// Create a new post
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file?.path;

    const post = new Post({
      caption,
      image,
      user: req.user._id, // Use req.user._id to get the current user's ID
    });

    await post.save();

    // Push post to user's posts array
    await User.findByIdAndUpdate(req.user.id, { $push: { posts: post._id } });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

const getUserIdFromPost = (postUser) => {
  if (!postUser) return null;

  // Case 1: New embedded user object
  if (postUser._id) return postUser._id.toString();

  // Case 2: Old ObjectId or buffer-like structure
  if (typeof postUser.toString === 'function') return postUser.toString();

  return null;
};

export const updatePost = async (req, res) => {
  try {
    const { caption } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const postUserId = getUserIdFromPost(post.user);
    const reqUserId = req.user._id.toString();


    if (!postUserId || postUserId !== reqUserId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.caption = caption;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error('Update Post Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username  avatar');

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    await Post.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user.id, { $pull: { posts: post._id } });

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post', error: err.message });
  }
};

export const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.likes.includes(req.user.id)) {
    return res.status(400).json({ message: 'Already liked' });
  }

  post.likes.push(req.user.id);
  await post.save();

  res.json({ message: 'Post liked' });
};

export const unlikePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  post.likes = post.likes.filter(id => id.toString() !== req.user.id);
  await post.save();

  res.json({ message: 'Post unliked' });
};


export const getNewsFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
console.log("CurrentUser:", currentUser.username);
console.log("Following:", currentUser.following);

    // Combine current user and following users
    const usersToFetchFrom = [req.user._id, ...currentUser.following];
    console.log("UsersToFetchFrom:", usersToFetchFrom);

    const posts = await Post.find({ user: { $in: usersToFetchFrom } })
      .populate('user', 'username avatar')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 });

      console.log("Fetched posts count:", posts.length);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get explore feed (trending or recent posts)
// @route   GET /api/posts/explore
// @access  Private
export const getExploreFeed = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const posts = await Post.find({
    user: { $ne: currentUserId }, // exclude current user's posts
  })
    .sort({ createdAt: -1 }) // or .sort({ likes: -1 }) for trending
    .populate("user", "username avatar")
    .populate("comments.user", "username avatar");

  res.status(200).json(posts);
});
