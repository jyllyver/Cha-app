// src/CameraCapture.jsx
import React, { useRef, useState, useEffect } from 'react';

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [sending, setSending] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  useEffect(() => {
    // Access camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing camera:", err);
      });
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);
      setResponseMsg('');
    }
  };

  const sendToAPI = async () => {
    if (!image) return;
    setSending(true);
    setResponseMsg('');

    // Convert base64 to Blob
    const blob = await (await fetch(image)).blob();
    const formData = new FormData();
    formData.append('image', blob, 'captured.png');

    try {
      const response = await fetch('http://192.168.1.17:5000/upload_image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setResponseMsg(`Response: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error('Upload failed:', error);
      setResponseMsg('Upload failed.');
    }

    setSending(false);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '400px' }} />
      <br />
      <button onClick={capturePhoto}>Capture</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {image && (
        <div>
          <h3>Captured Image:</h3>
          <img src={image} alt="Captured" style={{ width: '100%', maxWidth: '400px' }} />
          <br />
          <button onClick={sendToAPI} disabled={sending}>
            {sending ? 'Sending...' : 'Send to API'}
          </button>
          <p>{responseMsg}</p>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
