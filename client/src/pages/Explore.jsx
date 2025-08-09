import React, { useEffect, useState } from "react";
import axios from "../api/api"; // assuming you configured axios instance
import PostCard from "../components/PostCard"; // make sure this exists
import { Loader2 } from "lucide-react"; // optional: loading spinner

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExplorePosts = async () => {
    try {
      const res = await axios.get("/posts/explore");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to fetch explore posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Explore</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-white" />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-gray-400 text-center">No posts to explore yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
