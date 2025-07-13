import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    // Validate MongoDB URI exists
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB connection URI is not defined in environment variables');
    }

    // Simplified connection options (removed problematic options)
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      w: 'majority'
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
        
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
        
    // Connection event listeners - set these up once, not on every connection
    if (!mongoose.connection.listeners('connected').length) {
      mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to DB');
      });

      mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('Mongoose reconnected to DB');
      });
    }

    // Graceful shutdown handlers
    if (!process.listeners('SIGINT').some(listener => listener.name === 'mongooseShutdown')) {
      const mongooseShutdown = async () => {
        try {
          await mongoose.connection.close();
          console.log('Mongoose connection closed due to app termination');
          process.exit(0);
        } catch (error) {
          console.error('Error during graceful shutdown:', error);
          process.exit(1);
        }
      };
      
      Object.defineProperty(mongooseShutdown, 'name', { value: 'mongooseShutdown' });
      
      process.on('SIGINT', mongooseShutdown);
      process.on('SIGTERM', mongooseShutdown);
    }

    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
        
    // More detailed error logging
    if (error.name === 'MongoNetworkError') {
      console.error('Network error occurred. Please check:');
      console.error('- Is MongoDB running?');
      console.error('- Is the connection string correct?');
      console.error('- Are there any firewall restrictions?');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('Server selection error. Possible causes:');
      console.error('- Invalid replica set configuration');
      console.error('- No primary server available');
      console.error('- Network connectivity issues');
    } else if (error.name === 'MongoParseError') {
      console.error('Connection string parsing error:');
      console.error('- Check your MONGO_URI format');
      console.error('- Ensure special characters are URL encoded');
    } else if (error.code === 'ENOTFOUND') {
      console.error('DNS resolution failed - check your MongoDB host');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - MongoDB server may not be running');
    }
        
    process.exit(1);
  }
};

module.exports = connectDB;
