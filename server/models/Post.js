const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  caption: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
});

module.exports = mongoose.model('Post', PostSchema);