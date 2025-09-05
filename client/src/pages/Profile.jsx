import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import PostCard from "../components/PostCard";
import CreatePost from "./CreatePost";
import { useAuth } from "../context/AuthContext";

// Avatar component with hover effects
const Avatar = ({ user, size = "xl", className = "" }) => {
  const sizes = { 
    sm: "w-10 h-10", 
    md: "w-14 h-14", 
    lg: "w-20 h-20", 
    xl: "w-28 h-28" 
  };
  const cls = sizes[size] || sizes.xl;
  
  if (user?.avatar) {
    return (
      <img 
        src={user.avatar} 
        alt="avatar" 
        className={`${cls} rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-200 hover:scale-105 ${className}`} 
      />
    );
  }
  
  const initial = user?.username?.charAt(0)?.toUpperCase() || "U";
  return (
    <div className={`${cls} rounded-full border-4 border-white bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold shadow-lg transition-transform duration-200 hover:scale-105 ${className}`}>
      {initial}
    </div>
  );
};

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  
  // State management
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  
  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [coverImage, setcoverImage] = useState("");
  const [avatar, setAvatar] = useState("");
  
  // Post composer states - Remove these as we'll use CreatePost component
  // const [newPostText, setNewPostText] = useState("");
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [isPosting, setIsPosting] = useState(false);
  
  // File upload states for profile images
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);

  // Load current user and profile data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get profile user by username
        const profileRes = await api.get(`/users/username/${username}`);
        const profileData = profileRes.data;
        setProfileUser(profileData);
        
        // Set form data
        setBio(profileData.bio || "");
        setLocation(profileData.location || "");
        setOccupation(profileData.occupation || "");
        setHobbies(profileData.hobbies || "");
        setAvatar(profileData.avatar || "");
        setcoverImage(profileData.coverImage || "");
        
        // Check if current user is following profile user
        setIsFollowing((profileData.followers || []).includes(currentUser?._id));

        // Load posts for this user
        const postsRes = await api.get("/posts");
        const userPosts = (postsRes.data || []).filter(post => post.user?._id === profileData._id);
        setPosts(userPosts);
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };
    
    if (currentUser && username) {
      loadData();
    }
  }, [username, currentUser]);

  const isOwnProfile = currentUser?._id && profileUser?._id && currentUser._id === profileUser._id;

  // Debug logging for isOwnProfile
  useEffect(() => {
    console.log('isOwnProfile:', isOwnProfile, 'currentUser._id:', currentUser?._id, 'profileUser._id:', profileUser?._id);
  }, [isOwnProfile, currentUser?._id, profileUser?._id]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      const url = isFollowing ? `/users/${profileUser._id}/unfollow` : `/users/${profileUser._id}/follow`;
      await api.post(url);
      
      const newFollowStatus = !isFollowing;
      setIsFollowing(newFollowStatus);
      
      // Update profile user followers count
      setProfileUser(prev => ({
        ...prev,
        followers: newFollowStatus 
          ? [...(prev.followers || []), currentUser._id]
          : (prev.followers || []).filter(id => id !== currentUser._id)
      }));
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const updateData = { bio, location, occupation, hobbies, coverImage, avatar };
      
      // Upload avatar file if selected
      if (selectedAvatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", selectedAvatarFile);
        
        const avatarRes = await api.post("/profile/upload-avatar", avatarFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        const newAvatarUrl = avatarRes.data?.user?.avatar;
        if (newAvatarUrl) {
          updateData.avatar = newAvatarUrl;
          setAvatar(newAvatarUrl);
        }
      }
      
      // Upload cover file if selected
      if (selectedCoverFile) {
        const coverFormData = new FormData();
        coverFormData.append("coverImage", selectedCoverFile);
        
        const coverRes = await api.post("/profile/upload-cover", coverFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        const newCoverUrl = coverRes.data?.user?.coverImage;
        if (newCoverUrl) {
          updateData.coverImage = newCoverUrl;
          setcoverImage(newCoverUrl);
        }
      }
      
      const res = await api.put("/profile/me", updateData);
      
      // Update both current user and profile user with the response data
      const updatedUser = res.data;
      setCurrentUser(updatedUser);
      
      // Preserve existing followers data when updating profile user
      setProfileUser(prev => ({
        ...updatedUser,
        followers: prev?.followers || updatedUser.followers || []
      }));
      
      // Update the form fields with the new data
      setBio(updatedUser.bio || "");
      setLocation(updatedUser.location || "");
      setOccupation(updatedUser.occupation || "");
      setHobbies(updatedUser.hobbies || "");
      setAvatar(updatedUser.avatar || "");
      setcoverImage(updatedUser.coverImage || "");
      
      setEditMode(false);
      
      // Clear selected files after successful upload
      setSelectedAvatarFile(null);
      setSelectedCoverFile(null);
      
      // Refresh the page to ensure all state is properly reset
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      
      const res = await api.post("/profile/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const newAvatarUrl = res.data?.user?.avatar;
      if (newAvatarUrl) {
        setAvatar(newAvatarUrl);
        setProfileUser(prev => ({ ...prev, avatar: newAvatarUrl }));
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    }
  };

  // Handle cancel edit - reset images and clear selected files
  const handleCancelEdit = () => {
    setEditMode(false);
    setBio(profileUser.bio || "");
    setLocation(profileUser.location || "");
    setOccupation(profileUser.occupation || "");
    setHobbies(profileUser.hobbies || "");
    setAvatar(profileUser.avatar || "");
    setcoverImage(profileUser.coverImage || "");
    setSelectedAvatarFile(null);
    setSelectedCoverFile(null);
  };

  // Handle post creation callback
  const handlePostCreated = (newPost) => {
    // Add the new post to the beginning of posts array
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostDeleted = () => {
    // Refresh posts after deletion
    // You could also implement more efficient state updates here
    const loadPosts = async () => {
      try {
        const postsRes = await api.get("/posts");
        const userPosts = (postsRes.data || []).filter(post => post.user?._id === profileUser._id);
        setPosts(userPosts);
      } catch (error) {
        console.error("Failed to reload posts:", error);
      }
    };
    loadPosts();
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo Section */}
      <div className="relative h-80 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        {editMode && isOwnProfile && (
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setcoverImage(e.target.value)}
            placeholder="Cover image URL"
            className="absolute top-4 left-4 px-3 py-2 rounded-lg border bg-white/90 backdrop-blur-sm shadow-lg z-10"
          />
        )}
        
        <img
          src={coverImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"}
          alt="Cover"
          className={`w-full h-full object-cover ${editMode && isOwnProfile ? 'blur-sm' : ''}`}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Cover upload overlay when in edit mode */}
        {editMode && isOwnProfile && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <label className="flex flex-col items-center space-y-2 cursor-pointer p-4 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-white text-sm font-medium">Upload Cover</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Create a temporary URL for preview
                    const tempUrl = URL.createObjectURL(file);
                    setcoverImage(tempUrl);
                    // Store the file for later upload when saving
                    setSelectedCoverFile(file);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Profile Card with Glassmorphism */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-end justify-between">
            <div className="flex items-end space-x-6">
              <div className="relative">
                <Avatar user={{ ...profileUser, avatar }} size="xl" />
                
                {/* Avatar upload overlay when in edit mode */}
                {editMode && isOwnProfile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full backdrop-blur-sm">
                    <label className="flex flex-col items-center space-y-1 cursor-pointer p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white text-xs font-medium">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Create a temporary URL for preview
                            const tempUrl = URL.createObjectURL(file);
                            setAvatar(tempUrl);
                            // Store the file for later upload when saving
                            setSelectedAvatarFile(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              
              <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {profileUser.username}
                </h1>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                  <span className="cursor-pointer hover:text-blue-600 transition-colors">
                    {(profileUser.followers || []).length} Friends
                  </span>
                  <span>•</span>
                  <span>Joined {new Date(profileUser.createdAt || Date.now()).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  {location && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{location}</span>
                    </div>
                  )}
                  
                  {occupation && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5M16 6h6m-6 0h-6" />
                      </svg>
                      <span>{occupation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={editMode ? handleCancelEdit : () => setEditMode(true)}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {editMode ? "Cancel" : "Edit Profile"}
                  </button>
                  {editMode && (
                    <button
                      onClick={handleProfileUpdate}
                      className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                    >
                      Save
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isFollowing 
                        ? "bg-gray-100 text-gray-800 hover:bg-gray-200" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <button className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex items-center space-x-1 mb-8">
          {["posts", "about", "photos", "friends"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Basic info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-blue-600 cursor-pointer hover:text-blue-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>Add bio</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600 cursor-pointer hover:text-blue-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span>Edit details</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600 cursor-pointer hover:text-blue-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>Add hobbies</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Post Composer - Always show for own profile */}
              {isOwnProfile && (
                <CreatePost onPostCreated={handlePostCreated} />
              )}

              {/* Posts List */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                    currentUser={currentUser || { _id: "" }}
                    hideFollowButton={isOwnProfile} // Hide follow button for own posts
                    onPostDeleted={handlePostDeleted}
                  />
                ))}
                {posts.length === 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                    No posts yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Basic info</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900 font-medium">{profileUser.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 mb-1">Bio</label>
                    {isOwnProfile ? (
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell people about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900">{bio || "No bio set."}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 mb-1">Location</label>
                    {isOwnProfile ? (
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your location..."
                      />
                    ) : (
                      <p className="text-gray-900">{location || "No location set."}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 mb-1">Occupation</label>
                    {isOwnProfile ? (
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your occupation..."
                      />
                    ) : (
                      <p className="text-gray-900">{occupation || "No occupation set."}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 mb-1">Hobbies</label>
                    {isOwnProfile ? (
                      <textarea
                        value={hobbies}
                        onChange={(e) => setHobbies(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your hobbies..."
                      />
                    ) : (
                      <p className="text-gray-900">{hobbies || "No hobbies set."}</p>
                    )}
                  </div>
                  
                  {isOwnProfile && (
                    <>
                      <div>
                        <label className="block text-gray-500 mb-1">Change Avatar</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <button
                        onClick={handleProfileUpdate}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-600">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium">Tell people more about yourself...</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "photos" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {posts.map((post) => (
                <img
                  key={post._id}
                  src={post.image}
                  alt=""
                  className="w-full h-32 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                />
              ))}
              {posts.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No photos yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "friends" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Friends</h3>
            <div className="text-center text-gray-600 py-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="text-lg font-medium">Friends section coming soon.</p>
            </div>
          </div>
        )}
      </div>

      {/* Friends Modal */}
      {showFriendsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Friends</h3>
              <button
                onClick={() => setShowFriendsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center text-gray-500 py-4">
              Friends list coming soon...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
