import Post from '../models/Post.js';
export const commentPost = async (req, res) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = { user: req.user.id, text };
  post.comments.push(comment);
  await post.save();

  res.json({ message: 'Comment added' });
};


export const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user._id;

  try {
    const post = await Post.findOne({ 'comments._id': commentId });

    if (!post) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Find the comment to check ownership
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found in post' });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove comment manually
    post.comments = post.comments.filter(
      (c) => c._id.toString() !== commentId.toString()
    );

    await post.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

