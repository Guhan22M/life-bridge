// src/pages/GoogleSuccess.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get token and name from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token && name) {
      // Save to localStorage
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ token, name, email })
      );
      // Redirect to home
      navigate("/home");
    } else {
      // If no token, go back to login
      navigate("/");
    }
  }, [navigate]);

  return <p>Logging you in with Google...</p>;
};

export default GoogleSuccess;
