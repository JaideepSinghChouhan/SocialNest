import { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';

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
      <img
        src={user.avatar}
        alt={`${user.username}'s avatar`}
        className={`${sizeClass} rounded-full object-cover`}
        onError={(e) => {
          // Fallback to initials if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div className={`${sizeClass} bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold`}>
      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  );
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const userRes = await api.get('/profile/me');
        setCurrentUser(userRes.data);

        const token = localStorage.getItem('token');
        const res = await api.get('/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(res.data);  
        console.log('Posts fetched:', res.data);
      } catch (err) {
        console.error('Error loading feed:', err.response?.data || err);
      }
    };

    fetchFeed();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Primary Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/profile/${currentUser?.username}`} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Favorites</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Messages</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Friends</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>Feed</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Stories</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Events</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Memories</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Groups Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Groups</h2>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">🐶</div>
                  <span className="text-sm text-gray-700">Dog Lovers</span>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">🎮</div>
                  <span className="text-sm text-gray-700">GamerZzZz</span>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">👭</div>
                  <span className="text-sm text-gray-700">Travel Girls</span>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">😹</div>
                  <span className="text-sm text-gray-700">cat memez</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <Avatar user={currentUser} size="lg" />
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="What's on your mind?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-4">
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Photo</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">Location</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">Feeling</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Event</span>
                      </button>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} currentUser={currentUser} />
              ))}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Your upcoming events</h2>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Garden BBQ</p>
                    <p className="text-xs text-gray-500">Sat 16 June, Tom's Garden</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">City Council Vote</p>
                    <p className="text-xs text-gray-500">Sat 16 June, Town Hall</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Post-punk Festival</p>
                    <p className="text-xs text-gray-500">Sat 16 June, Tom's Garden</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Maybe Boring Stand-up</p>
                    <p className="text-xs text-gray-500">Sat 16 June, Tom's Garden</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Yabonue Tour 2023</p>
                    <p className="text-xs text-gray-500">Sat 16 June, Tom's Garden</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Community Chats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Community chats</h2>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">🐶</div>
                  <span className="text-sm text-gray-700">Dog Lovers</span>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">🇩🇰</div>
                  <span className="text-sm text-gray-700">Copenhagen friends</span>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">🚗</div>
                  <span className="text-sm text-gray-700">Y2K Car owners</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
