import axios from 'axios';

const api = axios.create({ 
  baseURL: "https://voting-platform-3soe.onrender.com",
  withCredentials: true 
});

export default api;