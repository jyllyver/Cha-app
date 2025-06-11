// src/components/CameraPreview.jsx
import React from 'react';

const CameraPreview = ({ videoRef }) => (
  <video
    ref={videoRef}
    autoPlay
    playsInline
    style={{ width: '100%', maxWidth: '400px' }}
  />
);

export default CameraPreview;
