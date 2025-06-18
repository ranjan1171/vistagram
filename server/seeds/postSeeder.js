require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Post = require('../models/Post');
const connectDB = require('../config/db');

// Sample base64 image (tiny transparent PNG)
const sampleImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

(async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Post.deleteMany();
    console.log('Cleared existing posts');

    // Generate 5 sample posts
    const posts = Array.from({ length: 5 }, () => ({
      username: faker.internet.username(), // Fixed deprecated method
      image: {
        data: sampleImage,
        contentType: 'image/png'
      },
      caption: faker.lorem.sentence(),
      likes: faker.number.int({ min: 0, max: 100 }),
      shares: faker.number.int({ min: 0, max: 20 }),
      timestamp: faker.date.past()
    }));

    await Post.insertMany(posts);
    console.log(`Created ${posts.length} sample posts`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
})();