// src/components/CaptureControls.jsx
import React from 'react';

const CaptureControls = ({ image, capturePhoto, sendToAPI, sending, responseMsg }) => (
  <div>
    <button onClick={capturePhoto}>Capture</button>

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

export default CaptureControls;
