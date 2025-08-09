import PostCard from "./PostCard";
const [posts, setPosts] = useState([]);

const fetchPosts = async () => {
  const { data } = await api.get('/posts');
  setPosts(data);
};

useEffect(() => {
  fetchPosts();
}, []);



function PostList() {
  return (
    <div>
      {posts.map((post) => (
    <PostCard
    key={post._id}
    post={post}
    currentUser={currentUser}
    onPostDeleted={fetchPosts} // 👈
  />
    ))}
    </div>
  )
}

export default PostList
