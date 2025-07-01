import React, { useState, useEffect } from 'react';
import './UploadImage.css';

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResultUrl(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch('http://127.0.0.1:5000/predict', {
  method: 'POST',
  body: formData,
});


      if (!res.ok) {
        throw new Error('Prediction failed.');
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setResultUrl(objectUrl);
    } catch (err) {
      setError('Server Error: Unable to connect.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl]);

  return (
    <div className="fullscreen-container">
      {/* Animated Background Elements */}
      <div className="background-overlay"></div>
      <div className="floating-particles">
        <div className="particle particle-1">🍃</div>
        <div className="particle particle-2">🌿</div>
        <div className="particle particle-3">🍃</div>
        <div className="particle particle-4">🌿</div>
        <div className="particle particle-5">🍃</div>
        <div className="particle particle-6">🌱</div>
        <div className="particle particle-7">🌿</div>
        <div className="particle particle-8">🍃</div>
      </div>

      {/* Animated Light Rays */}
      <div className="light-rays">
        <div className="ray ray-1"></div>
        <div className="ray ray-2"></div>
        <div className="ray ray-3"></div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper animate-fade-in-up">
        <div className="header-section">
          <div className="tree-icon animate-bounce-gentle">🌳</div>
          <h2 className="title animate-slide-up">
            <span className="title-text">Tea Crop</span>
            <span className="title-accent">AI Segmentation - Project by KAARTHIC VR</span>
          </h2>
          <p className="subtitle animate-fade-in-delayed">
            Advanced machine learning for precise tree analysis and segmentation
          </p>
        </div>

        <div className="cards-container">
          <div className="card upload-card animate-slide-in-left">
            <div className="upload-icon animate-pulse-gentle">📤</div>
            <h3 className="card-title">Upload Your Crop Image</h3>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleChange}
                className="file-input"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="file-input-label">
                <span className="upload-text">
                  <span className="upload-icon-small">🌿</span>
                  {image ? '✓ Image Selected' : 'Choose Tree Image'}
                </span>
              </label>
            </div>
            <button
              onClick={handleUpload}
              disabled={!image || loading}
              className={`upload-button ${loading ? 'loading' : ''}`}
            >
              <span className="button-icon">
                {loading ? '🔄' : ''}
              </span>
              <span className="button-text">
                {loading ? 'Processing Magic...' : 'Analyze Tree'}
              </span>
            </button>
            {error && (
              <div className="error-container animate-shake-error">
                <span className="error-icon">⚠️</span>
                <p className="error-text">{error}</p>
              </div>
            )}
          </div>

          <div className="images-grid">
            {preview && (
              <div className="card image-card preview-card animate-float">
                <div className="card-header">
                  <span className="card-icon">📷</span>
                  <h3 className="card-title">Original Image</h3>
                </div>
                <div className="image-wrapper">
                  <img src={preview} alt="Upload Preview" className="preview-image" />
                  <div className="image-overlay">
                    <span className="overlay-text">Ready for Analysis</span>
                  </div>
                </div>
              </div>
            )}

            {resultUrl && (
              <div className="card image-card result-card animate-glow-success">
                <div className="card-header">
                  <span className="card-icon animate-sparkle">✨</span>
                  <h3 className="card-title">AI Analysis Result</h3>
                </div>
                <div className="image-wrapper">
                  <img src={resultUrl} alt="Predicted Result" className="result-image" />
                  <div className="success-badge">
                    <span className="badge-icon">🎯</span>
                    <span className="badge-text">Analysis Complete</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
