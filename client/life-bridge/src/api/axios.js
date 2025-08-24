import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // or your deployed URL
//   withCredentials: true, // if using cookies/session
});

export default instance;
