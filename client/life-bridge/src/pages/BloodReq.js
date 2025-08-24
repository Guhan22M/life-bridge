import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import "../styles/bloodReq.css";

const BloodReq = () => {
  const [form, setForm] = useState({
    patientName: '',
    age: '',
    bloodGroup: '',
    unitsNeeded: '',
    condition: '',
    hospitalName: '',
    hospitalLocation: '',
    wardOrRoomNumber: '',
    contactDetails: '',
  });

  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const storedUser = localStorage.getItem('userInfo');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const {
      patientName,
      age,
      bloodGroup,
      unitsNeeded,
      condition,
      hospitalName,
      hospitalLocation,
      wardOrRoomNumber,
      contactDetails,
    } = form;

    if (
      !patientName || !age || !bloodGroup || !unitsNeeded || !condition ||
      !hospitalName || !hospitalLocation || !wardOrRoomNumber || !contactDetails
    ) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post('/api/blood-request', form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage(res.data.message);
      fetchHistory();
      setForm({
        patientName: '',
        age: '',
        bloodGroup: '',
        unitsNeeded: '',
        condition: '',
        hospitalName: '',
        hospitalLocation: '',
        wardOrRoomNumber: '',
        contactDetails: '',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to send blood request.');
    }
  };

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get('/api/blood-request/history', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [user.token]);

  const deleteHistory = async (id) => {
    try {
      await axios.delete(`/api/blood-request/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const openDetailsModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="bloodreq-container">
      <h3 className="page-title">🩸 Blood Request</h3>

      <div className="card form-card shadow-sm">
        <div className="row g-3">
          {[
            ['patientName', 'Patient Name'],
            ['age', 'Patient Age'],
            ['bloodGroup', 'Blood Group (A+, B-, etc)'],
            ['unitsNeeded', 'Units Needed'],
            ['condition', 'Medical Condition'],
            ['hospitalName', 'Hospital Name'],
            ['hospitalLocation', 'Hospital Location'],
            ['wardOrRoomNumber', 'Ward/Room Number'],
            ['contactDetails', 'Your Contact Number/Email']
          ].map(([name, label]) => (
            <div className="col-12" key={name}>
              <input
                className="form-control custom-input"
                type="text"
                name={name}
                placeholder={label}
                value={form[name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <button className="btn btn-danger w-100 mt-4 submit-btn" onClick={handleSubmit}>
          🚑 Send Request
        </button>

        {message && <div className="alert alert-success mt-3">{message}</div>}
      </div>

      <hr className="divider" />

      <h5 className="subtitle">📜 Your Previous Blood Requests</h5>
      {history.length === 0 ? (
        <p className="text-muted">No previous requests found.</p>
      ) : (
        <ul className="list-group history-list">
          {history.map((item) => (
            <li
              key={item._id}
              className="list-group-item history-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{item.patientName}</strong> 
                <span className="badge bg-danger ms-2">{item.bloodGroup}</span>
                <span className="badge bg-secondary ms-2">{item.unitsNeeded} units</span>
                <p className="small text-muted mt-1">{item.hospitalName}</p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openDetailsModal(item)}
                >
                  Details
                </button>
                <button
                  className="btn btn-sm btn-outline-danger delete-btn"
                  onClick={() => deleteHistory(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Details Modal */}
      {showModal && selectedRequest && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Patient Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Patient Name:</strong> {selectedRequest.patientName}</p>
                <p><strong>Age:</strong> {selectedRequest.age}</p>
                <p><strong>Blood Group:</strong> {selectedRequest.bloodGroup}</p>
                <p><strong>Units Needed:</strong> {selectedRequest.unitsNeeded}</p>
                <p><strong>Condition:</strong> {selectedRequest.condition}</p>
                <p><strong>Hospital:</strong> {selectedRequest.hospitalName}</p>
                <p><strong>Location:</strong> {selectedRequest.hospitalLocation}</p>
                <p><strong>Ward/Room:</strong> {selectedRequest.wardOrRoomNumber}</p>
                <p><strong>Contact:</strong> {selectedRequest.contactDetails}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodReq;
