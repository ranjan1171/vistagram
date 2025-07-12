

// Create a new post with image

const path = require('path');

const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { username, caption } = req.body;
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    const post = new Post({
      username,
      caption,
      imageUrl,
      timestamp: new Date(),
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post', details: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
  }
};
// Get post image by ID
exports.getPostImage = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || !post.image || !post.image.data) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.contentType(post.image.contentType);
    res.send(post.image.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch image', details: err.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like post', details: err.message });
  }
};

// Share a post
exports.sharePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ shares: post.shares });
  } catch (err) {
    res.status(500).json({ error: 'Failed to share post', details: err.message });
  }
};