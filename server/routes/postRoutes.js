const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middlewares/upload');

router.post('/', upload.single('image'), postController.createPost);
router.get('/', postController.getPosts);
router.post('/:id/like', postController.likePost);
router.post('/:id/share', postController.sharePost);

module.exports = router;