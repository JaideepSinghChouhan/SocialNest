import { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import LeftSidebar from '../components/LeftSidebar';
import MainFeed from '../components/MainFeed';
import RightSidebar from '../components/RightSidebar';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { user: currentUser } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      // Try to get newsfeed first (posts from followed users)
      const res = await api.get('/posts/newsfeed');
      setPosts(res.data);
      console.log('Newsfeed fetched:', res.data);
    } catch (err) {
      console.error('Error loading newsfeed, falling back to all posts:', err);
      // Fallback to all posts if newsfeed fails
      try {
        const res = await api.get('/posts');
        setPosts(res.data);
        console.log('All posts fetched:', res.data);
      } catch (fallbackErr) {
        console.error('Error loading posts:', fallbackErr.response?.data || fallbackErr);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser, fetchPosts]);

  const handlePostCreated = (newPost) => {
    // Add the new post to the beginning of the posts array
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handlePostDeleted = () => {
    // Refresh posts after deletion
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <LeftSidebar/>
          {/* Main Feed */}
          <MainFeed 
            posts={posts} 
            currentUser={currentUser} 
            onPostCreated={handlePostCreated}
            onPostDeleted={handlePostDeleted}
          />
          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
