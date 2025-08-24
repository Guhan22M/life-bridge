import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import "../styles/navbar.css";

import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
      setUser(storedUser);
    } catch (err) {
      console.error('Failed to parse userInfo from localStorage:', err);
      setUser(null);
    }
  }, [location]);

  const handleLogoClick = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-4 shadow-sm">
      <span 
        className="navbar-brand brand-name" 
        onClick={handleLogoClick}
      >
        LifeBridge
      </span>

      {user && (
        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="welcome-badge">Hi, {user.name} 👋</span>
          <button className="btn logout-btn" onClick={handleLogout}>
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
