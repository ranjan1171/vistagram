const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

// CREATE POST (handles image upload)
exports.createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Read the uploaded file as a buffer
    const imgPath = path.join(__dirname, '../uploads', req.file.filename);
    const imgBuffer = fs.readFileSync(imgPath);

    // Save post to DB
    const newPost = new Post({
      username: req.body.username || 'Anonymous',
      image: {
        data: imgBuffer,
        contentType: req.file.mimetype
      },
      caption: req.body.caption || '',
      likes: 0,
      shares: 0
    });

    const savedPost = await newPost.save();

    // Clean up uploaded file
    fs.unlinkSync(imgPath);

    // Respond with post data and a URL to fetch the image
    const responsePost = {
      ...savedPost.toObject(),
      imageUrl: `${process.env.SERVER_BASE_URL}/api/posts/${savedPost._id}/image`
    };

    res.status(201).json(responsePost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET ALL POSTS (with imageUrl)
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    const postsWithImageUrl = posts.map(post => ({
      ...post.toObject(),
      imageUrl: `${process.env.SERVER_BASE_URL}/api/posts/${post._id}/image`
    }));
    res.status(200).json(postsWithImageUrl);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Serve image buffer as file
exports.getPostImage = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || !post.image || !post.image.data) {
      return res.status(404).send('Image not found');
    }
    res.set('Content-Type', post.image.contentType);
    res.send(post.image.data);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).send('Error retrieving image');
  }
};

// LIKE POST
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.likes += 1;
    await post.save();

    res.status(200).json({ 
      message: 'Post liked successfully',
      likes: post.likes 
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: error.message });
  }
};

// SHARE POST
exports.sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.shares += 1;
    await post.save();

    res.status(200).json({ 
      message: 'Post shared successfully',
      shares: post.shares 
    });
  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({ error: error.message });
  }
};