import React, { useState } from 'react';

const AmbulancePrompt = ({ onProceed }) => {
  const [called, setCalled] = useState(false);

  const handleYes = () => {
    setCalled(true);
    const isMobile = /iPhone|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'tel:108';  // Opens phone dialer
    } else {
      alert('Please call 108 manually using your phone.');
    }
  };

  const handleNo = () => {
    onProceed();  // Go to main content
  };

  const handleContinue = () => {
    onProceed();  // Go to main content
  };

  return (
    <div className="container text-center mt-5">
      <h2>Are you in an emergency and need an ambulance?</h2>
      <div className="mt-4">
        <button className="btn btn-danger mx-2" onClick={handleYes}>
          Yes, Call 108
        </button>
        <button className="btn btn-secondary mx-2" onClick={handleNo}>
          No, Continue
        </button>
      </div>

      {called && (
        <div className="mt-4">
          <p className="text-success">Once your call is complete, click continue below.</p>
          <button className="btn btn-primary" onClick={handleContinue}>
            Continue to LifeBridge Help
          </button>
        </div>
      )}
    </div>
  );
};

export default AmbulancePrompt;
