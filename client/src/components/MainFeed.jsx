import React from 'react'
import Avatar from './Avatar'
import PostCard from './PostCard'
import CreatePost from '../pages/CreatePost'

const MainFeed = ({ posts, currentUser, onPostCreated, onPostDeleted }) => {

  return (
    <main className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <CreatePost onPostCreated={onPostCreated} />

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  currentUser={currentUser} 
                  onPostDeleted={onPostDeleted}
                />
              ))}
            </div>
          </main>
  )
}

export default MainFeed
