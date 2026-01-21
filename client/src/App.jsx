import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

import Login from './components/Login';
import Signup from './components/Signup';
import Vote from './components/Vote';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import CompleteProfile from './components/CompleteProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4 overflow-hidden relative">
        
        {/* Dynamic Background Bubbles from your exact consolidated code */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['rgba(255,182,193,0.3)', 'rgba(221,160,221,0.3)', 'rgba(173,216,230,0.3)'][i % 3],
            }}
            animate={{ y: [0, Math.random() * 200 - 100, 0], x: [0, Math.random() * 200 - 100, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id" element={<ResetPassword />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;