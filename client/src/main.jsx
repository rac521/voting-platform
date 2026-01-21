import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios'
import "./styles/index.css"; // Links the Tailwind theme and animations

// Global configuration: This ensures cookies (sessions) are sent with every request
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)