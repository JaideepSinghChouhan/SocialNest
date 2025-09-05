import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import api from '../api/api';

function CreatePost({ onPostCreated }) {
  const { user: currentUser } = useAuth();
  const [newPostText, setNewPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim() && !selectedFile) {
      toast.error('Please add some content to your post');
      return;
    }
    
    setIsPosting(true);
    try {
      let response;
      
      if (selectedFile) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("caption", newPostText);
        
        response = await api.post("/posts/create", formData, {
          headers: { 
            "Content-Type": "multipart/form-data" 
          }
        });
      } else {
        // Text-only post
        const postData = { caption: newPostText };
        response = await api.post("/posts/create", postData);
      }
      
      toast.success('Post created successfully!');
      
      // Reset form
      setNewPostText("");
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Notify parent component if callback provided
      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
    } catch (error) {
      console.error("Failed to create post:", error);
      const errorMessage = error.response?.data?.message || 'Failed to create post';
      toast.error(errorMessage);
    } finally {
      setIsPosting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleCreatePost();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        <Avatar user={currentUser} size="lg" />
        <div className="flex-1">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
            disabled={isPosting}
          />
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-3 relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-64 w-full object-cover rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                disabled={isPosting}
              >
                ×
              </button>
            </div>
          )}
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isPosting}
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isPosting}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Photo</span>
              </button>
              
              <button 
                disabled={isPosting}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">Location</span>
              </button>
              
              <button 
                disabled={isPosting}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Feeling</span>
              </button>
              
              <button 
                disabled={isPosting}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Event</span>
              </button>
            </div>
            
            <button 
              onClick={handleCreatePost} 
              disabled={isPosting || (!newPostText.trim() && !selectedFile)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPosting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting...</span>
                </div>
              ) : (
                'Post'
              )}
            </button>
          </div>
          
          {/* Character counter and tips */}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Press Ctrl+Enter to post quickly</span>
            <span className={newPostText.length > 500 ? 'text-red-500' : ''}>
              {newPostText.length}/500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
