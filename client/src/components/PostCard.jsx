import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api  from '../api/api'
import { toast } from 'react-hot-toast';

// Avatar component for reusability
const Avatar = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg'
  };

  const sizeClass = sizeClasses[size];

  if (user?.avatar) {
    return (
      <Link to={`/profile/${user.username}`}>
        <img
          src={user.avatar}
          alt={`${user.username}'s avatar`}
          className={`${sizeClass} rounded-full object-cover cursor-pointer`}
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      </Link>
    );
  }

  return (
    <Link to={`/profile/${user?.username}`}>
      <div className={`${sizeClass} bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer`}>
        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    </Link>
  );
};

const PostCard = ({ post, currentUser, onPostDeleted, hideFollowButton = false }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentInput, setCommentInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(post.caption);
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  // Update likes when post changes
  useEffect(() => {
    setLikes(post.likes || []);
  }, [post.likes]);

  // Update comments when post changes
  useEffect(() => {
    setComments(post.comments || []);
  }, [post.comments]);

  // Memoize isLiked to prevent unnecessary re-renders
  const isLiked = likes.includes(currentUser._id);
  const isOwner = post.user?._id === currentUser._id;

  const [isFollowing, setIsFollowing] = useState(
    post.user?.followers?.includes(currentUser._id)
  );

  const toggleFollow = async () => {
    try {
      const url = isFollowing
        ? `/users/${post.user._id}/unfollow`
        : `/users/${post.user._id}/follow`;
      await api.post(url);
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? 'Unfollowed' : 'Followed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleLike = async () => {
    if (isLiking) return; // Prevent rapid clicking
    
    setIsLiking(true);
    try {
      const url = isLiked 
        ? `/posts/${post._id}/unlike`
        : `/posts/${post._id}/like`;
      
      const res = await api.post(url);
      
      // Update likes state without causing re-render issues
      setLikes(prevLikes => {
        if (isLiked) {
          // Remove current user from likes
          return prevLikes.filter(id => id !== currentUser._id);
        } else {
          // Add current user to likes
          return [...prevLikes, currentUser._id];
        }
      });
      
      toast.success(isLiked ? 'Post unliked' : 'Post liked');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    if (!commentInput.trim()) return;
    if (isCommenting) return; // Prevent rapid clicking
    
    setIsCommenting(true);
    try {
      const res = await api.post(`/posts/${post._id}/comment`, { text: commentInput });
      
      // Use the server response which now includes populated user info
      if (res.data.comment) {
        setComments(prevComments => [...prevComments, res.data.comment]);
      } else {
        // Fallback if server doesn't return comment data
        const newComment = {
          _id: Date.now().toString(),
          text: commentInput,
          user: {
            _id: currentUser._id,
            username: currentUser.username,
            avatar: currentUser.avatar
          },
          createdAt: new Date().toISOString()
        };
        setComments(prevComments => [...prevComments, newComment]);
      }
      
      setCommentInput('');
      setShowComments(true);
      
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
      console.error(err);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/posts/${post._id}/comments/${commentId}`);
      
      // Remove comment from local state immediately
      setComments(prevComments => prevComments.filter(c => c._id !== commentId));
      
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment');
      console.error(err);
    }
  };

  const handleEditPost = async () => {
    try {
      const res = await api.put(`/posts/${post._id}`, { caption });
      toast.success('Post updated!');
      setIsEditing(false);
      setShowDropdown(false);
      onPostDeleted(); // optional callback to refetch post from parent
    } catch (err) {
      toast.error('Update failed');
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success('Post deleted');
      setShowDropdown(false);
      // Optionally: refresh posts or trigger a callback to parent component
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleShare = async () => {
    try {
      // Create shareable URL
      const shareUrl = `${window.location.origin}/post/${post._id}`;
      
      // Try to use native share API if available
      if (navigator.share) {
        await navigator.share({
          title: `${post.user?.username}'s post`,
          text: post.caption || 'Check out this post!',
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Post link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      toast.error('Failed to share post');
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar user={post.user} size="lg" />
          <div>
            <div className="font-semibold text-gray-900">{post.user?.username || 'Unknown'}</div>
            <div className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {post.user._id !== currentUser._id && !hideFollowButton && (
            <button
              onClick={toggleFollow}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isFollowing 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          
          {isOwner && (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              {/* Dropdown menu for edit/delete */}
              {showDropdown && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="relative">
          <img 
            src={post.image} 
            alt="Post" 
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="What's on your mind?"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleEditPost}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setCaption(post.caption);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 mb-4 leading-relaxed">{caption}</p>
        )}

        {/* Interaction Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span>{likes.length} likes</span>
            <span>{comments.length} comments</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-6 border-t border-gray-100 pt-4">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className={`h-5 w-5 ${isLiked ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm font-medium">
              {isLiking ? '...' : 'Like'}
            </span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            {/* Add Comment */}
            <div className="flex items-center space-x-3 mb-4">
              <Avatar user={currentUser} size="md" />
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Write a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isCommenting && handleComment()}
                  disabled={isCommenting}
                />
              </div>
              <button 
                onClick={handleComment}
                disabled={isCommenting || !commentInput.trim()}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  isCommenting || !commentInput.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isCommenting ? 'Posting...' : 'Post'}
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-3">
                  <Avatar user={comment.user} size="md" />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <Link 
                          to={`/profile/${comment.user?.username}`}
                          className="font-medium text-sm text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {comment.user?.username || 'Unknown User'}
                        </Link>
                        {comment.user?._id === currentUser._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
