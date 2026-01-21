import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, Sparkles, Vote } from "lucide-react"; // Added Vote icon for consistency
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/forgot-password", { email });
      setStatus(res.data.message);
      setIsError(false);
      setIsSubmitted(true); 
    } catch (err) {
      setStatus(err.response?.data?.error || "Error sending request.");
      setIsError(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      {/* Background Particles */}
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
                whileHover={{ rotate: [0, -10, 10, -10, 0] }} // EXACT SHAKE PROP
                transition={{ duration: 0.5 }}
              >
                <Mail className="w-12 h-12 text-white" />
              </motion.div>
            </div>

            <div className="text-center">
              <h2 className="text-4xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-bold">
                Recovery
              </h2>
              <p className="text-gray-600 flex items-center gap-2 justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Get a password reset link
                <Sparkles className="w-4 h-4 text-pink-400" />
              </p>
            </div>
          </div>

          {isSubmitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-300 to-emerald-300 rounded-full flex items-center justify-center shadow-lg">
                <Send className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl mb-2 text-gray-800 font-bold">Check Your Email!</h3>
              <p className="text-gray-600 mb-6 text-sm">Sent to: <span className="text-purple-600 font-bold">{email}</span></p>
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-purple-500 font-bold hover:underline">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-6">
              <div className="relative bg-white rounded-xl">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-300 outline-none bg-gradient-to-r from-pink-50/50 to-purple-50/50"
                />
              </div>

              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full relative overflow-hidden rounded-xl py-4 group shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
                <span className="relative flex items-center justify-center gap-2 text-white font-bold">
                  <Send className="w-5 h-5" />
                  <span>Send Reset Link</span>
                </span>
              </motion.button>

              {status && <p className={`text-center text-sm font-bold ${isError ? 'text-red-500' : 'text-green-600'}`}>{status}</p>}

              <div className="text-center pt-4">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 font-bold hover:text-purple-500 transition-colors">
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;