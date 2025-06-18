import axios from 'axios';

const API = axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Get all posts
export const getPosts = async () => {
  try {
    const response = await API.get('/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Create a new post
export const createPost = async (formData) => {
  try {
    const response = await API.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Like a post
export const likePost = async (postId) => {
  try {
    const response = await API.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

// Share a post
export const sharePost = async (postId) => {
  try {
    const response = await API.post(`/posts/${postId}/share`);
    return response.data;
  } catch (error) {
    console.error('Error sharing post:', error);
    throw error;
  }
};