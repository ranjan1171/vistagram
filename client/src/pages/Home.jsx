import { useState } from 'react';
import CameraModal from '../components/CameraModal';
import { createPost } from '../services/api';

const HomePage = ({ posts, onNewPost, onLike, onShare }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleCapture = async (imageFile, caption) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('caption', caption);
      formData.append('username', 'User_' + Math.floor(Math.random() * 1000));

      const newPost = await createPost(formData);
      onNewPost(newPost);
      setShowCamera(false);
      setUploadError(null);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Failed to upload post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="upload-section">
        <button 
          onClick={() => setShowCamera(true)}
          className="new-post-btn"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Create New Post'}
        </button>
        
        {uploadError && (
          <div className="error-message">{uploadError}</div>
        )}
      </div>
      
      {showCamera && (
        <CameraModal
          onCapture={handleCapture}
          onClose={() => {
            setShowCamera(false);
            setUploadError(null);
          }}
        />
      )}
    </div>
  );
};

export default HomePage;