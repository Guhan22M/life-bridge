import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../api/axios';
import uploadToCloudinary from '../utils/uploadToCloudinary';
// import "../styles/firstAid.css";
import "../styles/firstAid.css"

const FirstAid = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // NEW
  const fileInputRef = useRef(null);

  const storedUser = localStorage.getItem('userInfo');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleUpload = async () => {
    if (!description && !image) {
      alert('Please provide either a description or upload an image');
      return;
    }
    if (!user || !user.token) {
      alert('User not authenticated');
      return;
    }

    try {
      setLoading(true); // start loading
      setResult(''); // clear previous result
      let inputType, inputContent;

      if (image && description) {
        inputType = 'both';
        const cloudinaryUrl = await uploadToCloudinary(image);
        inputContent = { image: cloudinaryUrl, description };
      } else if (image) {
        inputType = 'image';
        inputContent = await uploadToCloudinary(image);
      } else {
        inputType = 'description';
        inputContent = description;
      }

      const res = await axios.post(
        '/api/first-aid',
        { inputType, inputContent },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setResult(res.data.aiResponse);
      setDescription("");
      setImage(null);
      if(fileInputRef.current){
        fileInputRef.current.value="";
      }
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert('Failed to generate first aid.');
    } finally {
      setLoading(false); // stop loading
    }
  };

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get('/api/first-aid/history', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [user.token]);

  const deleteHistory = async (id) => {
    try {
      await axios.delete(`/api/first-aid/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const openDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="firstaid-container">
      {/* Title */}
      <h3 className="title">🩺 First Aid Assistant</h3>
  
      {/* Input Section */}
      <div className="card input-card shadow-sm">
        <textarea
          className="input-box mb-3"
          placeholder="Describe your issue..."
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
  
        <div className="mb-3">
          {/* <label className="form-label subtitle">Upload Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="input-box"
            onChange={(e) => setImage(e.target.files[0])}
            ref={fileInputRef}
          /> */}

          {/* Camera only */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            id="cameraInput"
            onChange={(e) => setImage(e.target.files[0])}
            ref={fileInputRef}
          />
          <label htmlFor="cameraInput" className="btn btn-outline-primary w-100 mb-2">
            📷 Take Photo
          </label>

          {/* Gallery/file picker */}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="fileInput"
            onChange={(e) => setImage(e.target.files[0])}
            ref={fileInputRef}
          />
          <label htmlFor="fileInput" className="btn btn-outline-secondary w-100">
            🖼️ Choose from Gallery
          </label>

        </div>
  
        <button
          className="btn btn-primary w-100"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "⏳ Generating..." : "🚑 Generate Help"}
        </button>
      </div>
  
      {/* Loader */}
      {loading && (
        <div className="loader-section text-center mt-4">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Analyzing your input and generating first aid suggestion...</p>
        </div>
      )}
  
      {/* Result */}
      {!loading && result && (
        <div className="card result-card shadow-sm mt-4">
          <div className="card-header bg-success text-white">
            <h6 className="mb-0 subtitle">✅ First Aid Suggestion</h6>
          </div>
          <ul className="list-group list-group-flush">
            {result.split(/\n|•|-|\d+\./).map((line, idx) =>
              line.trim() ? (
                <li key={idx} className="list-group-item d-flex align-items-center">
                  <span className="step-icon me-2">!</span>
                  {line.replace(/\*\*/g, "").trim()}
                </li>
              ) : null
            )}
          </ul>
        </div>
      )}
  
      <hr className="my-4" />
  
      {/* History Section */}
      <h5 className="subtitle">📜 Your First Aid History</h5>
      {history.length === 0 ? (
        <p className="text-muted">No history found.</p>
      ) : (
        <ul className="list-group history-list">
          {history.map((item) => (
            <li
              key={item._id}
              className="list-group-item d-flex justify-content-between align-items-center history-item"
            >
              <span className="text-truncate">
                <strong>[{item.inputType}]</strong>&nbsp;
                {typeof item.inputContent === "string"
                  ? item.inputContent.substring(0, 30)
                  : JSON.stringify(item.inputContent).substring(0, 30)}
                ...
              </span>
              <div>
                <button
                  className="btn btn-sm btn-outline-info me-2"
                  onClick={() => openDetails(item)}
                >
                  Details
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteHistory(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
  
      {/* Modal */}
      {showModal && selectedItem && (
        <div className="custom-modal-overlay">
          <div className="custom-modal shadow-lg">
            <div className="modal-header border-0">
              <h5 className="modal-title">🩺 First Aid Details</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Type:</strong> {selectedItem.inputType}
              </p>
  
              {selectedItem.inputType === "description" && (
                <p>
                  <strong>Description:</strong> {selectedItem.inputContent}
                </p>
              )}
  
              {selectedItem.inputType === "image" && (
                <img
                  src={selectedItem.inputContent}
                  alt="Uploaded"
                  className="img-fluid rounded mb-3"
                />
              )}
  
              {selectedItem.inputType === "both" && (
                <>
                  <p>
                    <strong>Description:</strong> {selectedItem.inputContent.description}
                  </p>
                  <img
                    src={selectedItem.inputContent.image}
                    alt="Uploaded"
                    className="img-fluid rounded mb-3"
                  />
                </>
              )}
  
              <hr />
              <h6 className="subtitle">AI Suggestion:</h6>
              <ul className="list-group list-group-flush">
                {selectedItem.aiResponse.split(/\n|•|-|\d+\./).map((line, idx) =>
                  line.trim() ? (
                    <li key={idx} className="list-group-item d-flex align-items-center">
                      <span className="step-icon me-2">!</span>
                      {line.replace(/\*\*/g, "").trim()}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-secondary w-100" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FirstAid;
