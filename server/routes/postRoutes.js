const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middlewares/upload');

// Create new post with image upload
router.post('/', upload.single('image'), postController.createPost);

// Get all posts
router.get('/', postController.getPosts);

// Get post image by ID
router.get('/:id/image', postController.getPostImage);

// Like a post
router.post('/:id/like', postController.likePost);

// Share a post
router.post('/:id/share', postController.sharePost);

module.exports = router;