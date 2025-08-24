import React, { useState } from 'react';
import AmbulancePrompt from '../components/AmbulancePrompt';
import FirstAid from './FirstAid';
import BloodReq from './BloodReq';

const Home = () => {
  const [showMainSections, setShowMainSections] = useState(false);
  const [activeTab, setActiveTab] = useState('firstAid'); // 'firstAid' or 'bloodReq'

  return (
    <div className="container mt-4">
      {!showMainSections ? (
        <AmbulancePrompt onProceed={() => setShowMainSections(true)} />
      ) : (
        <>
          {/* Toggle Buttons */}
          <div className="d-flex justify-content-center mb-4">
            <button
              className={`btn btn-outline-primary mx-2 ${activeTab === 'firstAid' ? 'active' : ''}`}
              onClick={() => setActiveTab('firstAid')}
            >
              🩺 First Aid
            </button>
            <button
              className={`btn btn-outline-danger mx-2 ${activeTab === 'bloodReq' ? 'active' : ''}`}
              onClick={() => setActiveTab('bloodReq')}
            >
              🩸 Blood Request
            </button>
          </div>

          {/* Tab Content */}
          <div className="row">
            <div className="col-12">
              {activeTab === 'firstAid' && <FirstAid />}
              {activeTab === 'bloodReq' && <BloodReq />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
