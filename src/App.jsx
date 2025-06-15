import React, { useState } from 'react';
import {
  containerStyle,
  imageStyle,
  buttonStyle,
  disabledButtonStyle,
  responseTextStyle
} from './styles/AppStyles';

import { Camera, CameraResultType } from '@capacitor/camera';
import { registerPlugin } from '@capacitor/core';

const TFLitePlugin = registerPlugin('TFLite');

const CameraCapture = () => {
  const [image, setImage] = useState(null);
  const [sending, setSending] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  const capturePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        allowEditing: false,
      });
      setImage(photo.dataUrl);
      setResponseMsg('');
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const sendToAPI = async () => {
    if (!image) return;
    setSending(true);
    setResponseMsg('');
  
    try {
      const result = await TFLitePlugin.classify({ image });
  
      const message = result.message;
      setResponseMsg(message);
      alert(message);
    } catch (error) {
      console.error('Error:', error);
      setResponseMsg('Failed to send image.');
    }
  
    setSending(false);
  };

  return (
    <div style={containerStyle}>
      <button onClick={capturePhoto} style={buttonStyle}>Capture</button>

      {image && (
        <div style={{ textAlign: 'center' }}>
          <h3>Captured Image:</h3>
          <img src={image} alt="Captured" style={imageStyle} />
          <button
            onClick={sendToAPI}
            disabled={sending}
            style={sending ? disabledButtonStyle : buttonStyle}
          >
            {sending ? 'Sending...' : 'Send to API'}
          </button>
          <p style={responseTextStyle}>{responseMsg}</p>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
