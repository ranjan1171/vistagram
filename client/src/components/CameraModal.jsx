import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CameraModal = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);
  const [caption, setCaption] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = async () => {
    setIsCapturing(true);
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error('Failed to capture image');
      
      // Convert data URL to blob
      const blob = await fetch(imageSrc).then(res => res.blob());
      const file = new File([blob], `capture-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });
      
      onCapture(file, caption);
    } catch (error) {
      console.error('Capture error:', error);
      alert('Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="camera-modal">
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="camera-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
          style={{ width: '100%' }}
        />
      </div>
      <input
        type="text"
        placeholder="Add a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="caption-input"
      />
      <button 
        onClick={capture} 
        disabled={isCapturing}
        className="capture-btn"
      >
        {isCapturing ? 'Capturing...' : 'Capture Photo'}
      </button>
    </div>
  );
};

export default CameraModal;