import { useState, useEffect } from 'react';
import Post from './components/Post';
import HomePage from './pages/Home';
import { getPosts, likePost, sharePost } from './services/api';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
      setError(null);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      // Refresh posts to get updated like count
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = async (postId) => {
    try {
      await sharePost(postId);
      // Refresh posts to get updated share count
      fetchPosts();
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app">
      <div className="header">
        <h1>Vistagram</h1>
      </div>
      
      <HomePage 
        posts={posts}
        onNewPost={handleNewPost}
        onLike={handleLike}
        onShare={handleShare}
      />
      
      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map(post => (
            <Post 
              key={post._id} 
              post={post}
              onLike={handleLike}
              onShare={handleShare}
            />
          ))
        ) : (
          <div className="no-posts">No posts yet. Create your first post!</div>
        )}
      </div>
    </div>
  );
}

export default App;