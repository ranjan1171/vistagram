import { useState } from 'react';
import { FaHeart, FaShare } from 'react-icons/fa';

const Post = ({ post, onLike, onShare }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [shares, setShares] = useState(post.shares || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (isLiked) return;
    
    try {
      await onLike(post._id);
      setLikes(likes + 1);
      setIsLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = async () => {
    try {
      const postUrl = `${window.location.origin}/post/${post._id}`;
      await navigator.clipboard.writeText(postUrl);
      await onShare(post._id);
      setShares(shares + 1);
      alert('Post link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing post:', error);
      alert('Failed to copy link');
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <h3>{post.username}</h3>
        <span className="timestamp">
          {new Date(post.timestamp).toLocaleString()}
        </span>
      </div>

      <div className="image-container">
        <img 
          src={post.imageUrl}
          alt={post.caption}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x300?text=Image+Not+Available';
          }}
        />
      </div>

      <div className="post-footer">
        <p className="caption">{post.caption}</p>
        
        <div className="post-actions">
          <button 
            onClick={handleLike}
            className={`action-btn ${isLiked ? 'liked' : ''}`}
            disabled={isLiked}
          >
            <FaHeart /> {likes}
          </button>
          <button
            onClick={handleShare}
            className="action-btn"
          >
            <FaShare /> {shares}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;