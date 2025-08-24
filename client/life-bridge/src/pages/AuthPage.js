import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import usePassToggle from '../components/UsePassToggle';
// import { GoogleLogin } from '@react-oauth/google';
// import axios from 'axios';
import axios from '../api/axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [passwordType, toggleIcon] = usePassToggle();

  const navigate = useNavigate();

  useEffect(()=>{
    try{
      const user = JSON.parse(localStorage.getItem('userInfo'));
      if(user && user.email){
        navigate('/home');
      }
    }catch{
      localStorage.removeItem("userInfo");
    }
  },[navigate])

  const handleToggle = (mode) => {
    setIsLogin(mode);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      let res;
      console.log("Sending data", formData);
      if(isLogin){
        res =await axios.post('/api/users/login',{
          email:formData.email,
          password:formData.password,
        });
      }else{
        res =await axios.post('/api/users',formData);
        console.log("Registered Successful",res.data);
      }
      if(res && res.data){
        localStorage.setItem("userInfo",JSON.stringify(res.data));
        navigate('/home');
      }
    }catch(err){
      console.log("Auth error", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");

    if (token && name) {
      const userData = { token, name, email: "" }; 
      localStorage.setItem("userInfo", JSON.stringify(userData));
      navigate("/home");
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google"; 
  };

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <span className={isLogin ? 'active' : ''} onClick={() => handleToggle(true)}>Login </span> |
        <span className={!isLogin ? 'active' : ''} onClick={() => handleToggle(false)} > Register </span>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required/>
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type={passwordType} name="password" value={formData.password} onChange={handleChange} required
          />
          <span className='password-toggle-icon'>{toggleIcon}</span>
        </div>
        <button type="submit" className="submit-btn">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      {isLogin && (<h6 style={{alignItems:'center', justifyContent:'center', padding:'2px'}}>Or</h6>)}
      {isLogin && (
        <div className="google-login-container">
          <button type="button" className="google-btn" onClick={handleGoogleLogin}>
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
