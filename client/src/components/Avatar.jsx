import React from 'react'

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
  )
}

export default Avatar
