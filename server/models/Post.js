const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  caption: {
    type: String,
    default: '',
    trim: true
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  shares: {
    type: Number,
    default: 0,
    min: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Add index for better query performance
PostSchema.index({ timestamp: -1 });

// Post save middleware for error handling
PostSchema.post('save', function(error, doc, next) {
  if (error.name === 'ValidationError') {
    next(new Error(Object.values(error.errors).map(val => val.message).join(', ')));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Post', PostSchema);