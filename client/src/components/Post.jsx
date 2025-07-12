import React from 'react';

function Post({ post, onLike, onShare }) {
  return (
    <div className="post">
      <div className="post-header">
        <h3>@{post.username}</h3>
        <span>{new Date(post.timestamp).toLocaleString()}</span>
      </div>
      <div className="image-container">
        <img
          src={post.imageUrl}
          alt="Post"
          style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '6px', background: '#eee' }}
        />
      </div>
      <div className="post-content">
        <p>{post.caption}</p>
      </div>
      <div className="post-stats">
        <button onClick={() => onLike(post._id)}>❤️ {post.likes} Like</button>
        <button onClick={() => onShare(post._id)}>🔄 {post.shares} Share</button>
      </div>
    </div>
  );
}

export default Post;