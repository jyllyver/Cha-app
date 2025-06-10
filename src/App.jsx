import { useState } from 'react';

// The URL of your Flask API endpoint.
// Using the local network IP address provided by your Flask server.
const FLASK_API_URL = 'http://192.168.1.17:5000/upload_image';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false); // State to manage loading status
  const [responseMessage, setResponseMessage] = useState(''); // State to display API response

  /**
   * Handles the change event when a file is selected using the input field.
   * Updates the selected file and generates a preview URL for images.
   * @param {Event} event The change event from the file input.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a URL for image preview if the selected file is an image
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null); // Clear preview for non-image files
      }
      setResponseMessage(''); // Clear any previous response messages
      console.log('Selected file:', file.name);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setResponseMessage('');
    }
  };

  /**
   * Handles the file upload process.
   * Constructs a FormData object and sends it to the Flask API using fetch.
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setResponseMessage('Please select a file first.');
      return;
    }

    setUploading(true); // Start loading
    setResponseMessage('Uploading...'); // Update message

    // Create a FormData object to send the file.
    // This is essential for sending files via multipart/form-data.
    const formData = new FormData();
    // The key 'image' must match what your Flask API expects (request.files['image'])
    formData.append('image', selectedFile);

    try {
      const response = await fetch(FLASK_API_URL, {
        method: 'POST',
        body: formData, // FormData automatically sets the Content-Type header
      });
      console.log('image is uploaded');

      const data = await response.json(); // Parse the JSON response from Flask
      

      if (response.ok) {
        // If the HTTP status is 2xx (e.g., 200 OK)
        setResponseMessage(`Success: ${data.message} (File: ${data.filename})`);
        setSelectedFile(null); // Clear selected file
        setPreviewUrl(null); // Clear preview
      } else {
        // If the HTTP status is an error (e.g., 400 Bad Request)
        setResponseMessage(`Error: ${data.message || 'Unknown error occurred.'}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setResponseMessage(`Network Error: Could not connect to API. Is Flask running?`);
    } finally {
      setUploading(false); // Stop loading
    }
  };

  return (
    <div>
      <h2>Image Uploader</h2>

      {/* File input */}
      <div>
        <label htmlFor="file-upload">
          Select an image to upload:
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept="image/*" // Restrict to image files
        />
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
      >
        {uploading ? (
          <div>
            Uploading...
          </div>
        ) : (
          'Upload Image'
        )}
      </button>

      {/* Display selected file info and preview */}
      {selectedFile && (
        <div>
          <p>
            <strong>Selected file:</strong> {selectedFile.name}
          </p>

          {/* Show preview if the file is an image */}
          {previewUrl && (
            <div>
              <img
                src={previewUrl}
                alt="Image Preview"
                style={{ maxWidth: '300px', marginTop: '10px' }}
              />
            </div>
          )}
        </div>
      )}

      {/* Display API response message */}
      {responseMessage && (
        <div>
          {responseMessage}
        </div>
      )}
    </div>
  );
}
