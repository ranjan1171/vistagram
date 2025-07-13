import React, { useState, useEffect } from 'react';
import CameraModal from './components/CameraModal';
import Post from './components/Post';
import { likePost, sharePost } from './services/api';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const IMAGE_BASE_URL = API_BASE_URL.replace('/api', '');

const fetchPosts = async () => {
  setLoading(true);
  const response = await fetch(`${API_BASE_URL}/posts`);
  const data = await response.json();
  setPosts(Array.isArray(data) ? data : []);
  setLoading(false);
};

const handleCapture = async (imageFile, caption) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('caption', caption);
  formData.append('username', 'User_' + Math.floor(Math.random() * 1000));
  await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    body: formData,
  });
  setShowCamera(false);
  fetchPosts();
};


  const handleLike = async (postId) => {
    await likePost(postId);
    setPosts(posts.map(post =>
      post._id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleShare = async (postId) => {
    await sharePost(postId);
    setPosts(posts.map(post =>
      post._id === postId ? { ...post, shares: post.shares + 1 } : post
    ));
  };

  return (
    <div className="app">
      <button onClick={() => setShowCamera(true)} className="new-post-btn">
        Create New Post
      </button>
      {showCamera && (
        <CameraModal
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
      <div className="posts-container">
        {loading ? (
          <div>Loading...</div>
        ) : (
 posts.map(post => (
 <Post
  key={post._id}
  post={{
    ...post,
    imageUrl: post.imageUrl && post.imageUrl.startsWith('/uploads/')
      ? `${IMAGE_BASE_URL}${post.imageUrl}`
      : 'https://via.placeholder.com/500x300?text=No+Image'
  }}
  onLike={handleLike}
  onShare={handleShare}
/>
))
        )}
      </div>
    </div>
  );
}

export default App;
