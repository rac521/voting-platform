import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, CheckCircle, Eye, EyeOff, Sparkles } from "lucide-react";
import axios from "axios";

const ResetPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Logic States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // UI States
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      // Functional Logic: Hits your backend reset route
      const res = await axios.post(`https://voting-platform-3soe.onrender.com/auth/reset-password/${id}`, { 
        password: newPassword 
      });
      
      if (res.data.success) {
        setIsSubmitted(true);
        // Requirement: Redirect back to login after success
        setTimeout(() => navigate("/"), 3000); 
      }
    } catch (err) {
      alert("Error: Could not update password.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      {/* Dynamic Background Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: ['#FFB6C1', '#DDA0DD', '#ADD8E6', '#FFDAB9'][i % 4],
            left: `${(i % 4) * 25}%`,
            top: `${Math.floor(i / 4) * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-3xl blur-lg opacity-60"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/40">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative mb-4">
              <motion.div
                className="absolute inset-0 -m-3"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full border-4 border-dashed border-pink-300/50" />
              </motion.div>
              
              <motion.div 
                className="relative bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-5 rounded-2xl"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }} // EXACT SHAKE LOGIC
                transition={{ duration: 0.5 }}
              >
                <Lock className="w-12 h-12 text-white" />
              </motion.div>
            </div>

            <div className="text-center">
              <h2 className="text-4xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-bold">
                New Password
              </h2>
              <p className="text-gray-600 flex items-center gap-2 justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Enter your new secure password
                <Sparkles className="w-4 h-4 text-pink-400" />
              </p>
            </div>
          </div>

          {isSubmitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-300 to-emerald-300 rounded-full flex items-center justify-center shadow-lg"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl mb-2 text-gray-800 font-bold">Password Updated!</h3>
              <p className="text-gray-600 mb-6">Redirecting you to login...</p>
              <motion.a href="/" className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-bold">
                Go to Login
              </motion.a>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password Field */}
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <label className="block text-sm text-gray-700 mb-2 font-medium">Enter New Password</label>
                <div className="relative bg-white rounded-xl">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setFocusedField('new')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-300 outline-none transition-all bg-gradient-to-r from-pink-50/50 to-purple-50/50"
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <label className="block text-sm text-gray-700 mb-2 font-medium">Confirm New Password</label>
                <div className="relative bg-white rounded-xl">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-300 outline-none transition-all bg-gradient-to-r from-blue-50/50 to-purple-50/50"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Security Requirements List */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-2 font-bold">Security Requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1 italic">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-400 rounded-full" /> At least 8 characters</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-400 rounded-full" /> Must match confirmation field</li>
                </ul>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full relative overflow-hidden rounded-xl py-4 group shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
                <span className="relative flex items-center justify-center gap-2 text-white font-black uppercase tracking-wider">
                  <CheckCircle className="w-5 h-5" />
                  <span>Update Password</span>
                </span>
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;