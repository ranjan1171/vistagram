const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const path = require('path');
const app = express();
import dotenv from 'dotenv';
dotenv.config();


// Middleware
app.use(cors({
  origin: 'https://vistagram-frontend.onrender.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Type'] // Add this line
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/posts', postRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.message.includes('Only images are allowed')) {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
