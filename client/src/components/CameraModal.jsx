import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

function CameraModal({ onCapture, onClose }) {
  const webcamRef = useRef(null);
  const [caption, setCaption] = useState('');
  const [imgSrc, setImgSrc] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  };

  const handleSave = () => {
    if (!imgSrc) return;
    // Convert base64 to File
    const arr = imgSrc.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    const file = new File([u8arr], 'capture.jpg', { type: mime });
    onCapture(file, caption);
  };

  return (
    <div className="camera-modal">
      <div className="modal-content">
        {!imgSrc ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={400}
            />
            <button onClick={capture}>Capture</button>
          </>
        ) : (
          <>
            <img src={imgSrc} alt="Captured" width={400} />
            <input
              type="text"
              placeholder="Enter caption"
              value={caption}
              onChange={e => setCaption(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setImgSrc(null)}>Retake</button>
          </>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default CameraModal;