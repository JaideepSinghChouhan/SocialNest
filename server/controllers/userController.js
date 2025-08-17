import { User } from '../models/User.js';
import asyncHandler from 'express-async-handler';
// Follow user
export const followUser = async (req, res) => {
  const userIdToFollow = req.params.id;
  const currentUserId = req.user._id;


  if (userIdToFollow === currentUserId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  const userToFollow = await User.findById(userIdToFollow);
  const currentUser = await User.findById(currentUserId);





  if (!userToFollow || !currentUser) {
    return res.status(404).json({ message: "User not found" });
  }

  if (currentUser.following.includes(userIdToFollow)) {
    return res.status(400).json({ message: "Already following this user" });
  }

  currentUser.following.push(userIdToFollow);
  userToFollow.followers.push(currentUserId);

  await currentUser.save();
  await userToFollow.save();

  res.json({ message: "User followed" });
};



// Unfollow user
export const unfollowUser = async (req, res) => {
  const userIdToUnfollow = req.params.id;
  const currentUserId = req.user._id;

  const userToUnfollow = await User.findById(userIdToUnfollow);
  const currentUser = await User.findById(currentUserId);

  if (!userToUnfollow || !currentUser) {
    return res.status(404).json({ message: "User not found" });
  }

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== userIdToUnfollow
  );
  userToUnfollow.followers = userToUnfollow.followers.filter(
    (id) => id.toString() !== currentUserId.toString()
  );

  await currentUser.save();
  await userToUnfollow.save();

  res.json({ message: "User unfollowed" });
};


export const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const users = await User.find({
    username: { $regex: query, $options: "i" }, // case-insensitive
  }).select("username avatar _id");

  res.status(200).json(users);
});


// GET /api/users/username/:username
export const getUserByUsername = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

