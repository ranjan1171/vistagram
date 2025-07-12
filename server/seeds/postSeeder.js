require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Post = require('../models/Post');
const connectDB = require('../config/db');

// Sample base64 images (different tiny images for variety)
const sampleImages = [
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // transparent
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', // red
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // green
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA4WjR5wAAAABJRU5ErkJggg==', // blue
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==' // yellow
];

// Sample captions for more realistic content
const sampleCaptions = [
  "Beautiful sunset today! 🌅",
  "Coffee and coding ☕️💻",
  "Weekend vibes 🌸",
  "Just finished an amazing workout! 💪",
  "Homemade pasta for dinner 🍝",
  "Reading a great book 📚",
  "City lights at night ✨",
  "Morning hike in the mountains 🏔️",
  "Fresh flowers from the garden 🌺",
  "Cozy evening at home 🏠"
];

const seedPosts = async () => {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    const deletedCount = await Post.deleteMany();
    console.log(`🗑️ Cleared ${deletedCount.deletedCount} existing posts`);

    // Generate sample posts
    const posts = Array.from({ length: 10 }, (_, index) => ({
      username: faker.internet.username(),
      image: {
        data: faker.helpers.arrayElement(sampleImages),
        contentType: 'image/png'
      },
      caption: faker.helpers.arrayElement(sampleCaptions),
      likes: faker.number.int({ min: 0, max: 500 }),
      shares: faker.number.int({ min: 0, max: 50 }),
      timestamp: faker.date.past({ years: 1 }) // Posts from the last year
    }));

    // Insert posts
    const createdPosts = await Post.insertMany(posts);
    console.log(`✅ Successfully created ${createdPosts.length} sample posts`);
    
    // Display summary
    console.log('\n📊 Posts Summary:');
    createdPosts.forEach((post, index) => {
      console.log(`${index + 1}. @${post.username}: "${post.caption}" (${post.likes} likes, ${post.shares} shares)`);
    });
    
    console.log('\n🎉 Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      console.error('Validation Error Details:');
      Object.keys(error.errors).forEach(key => {
        console.error(`- ${key}: ${error.errors[key].message}`);
      });
    } else if (error.code === 11000) {
      console.error('Duplicate key error - some posts may already exist');
    }
    
    process.exit(1);
  } finally {
    // Always close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
    }
    process.exit(0);
  }
};

// Run the seeder
seedPosts();