import React, { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import axios from "axios";

const CompleteProfile = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return alert("LinkedIn URL is required to continue.");
    
    setLoading(true);
    try {
      await axios.post(
        "/api/user/update-linkedin", 
        { linkedInProfile: url }, 
        { withCredentials: true }
      );
      window.location.href = "/vote";
    } catch (err) {
      alert("Error saving profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="relative w-full max-w-md"
      >
        <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/40">
          <div className="flex flex-col items-center mb-8 text-center">
            {/* Circle removed from here */}
            <motion.div 
              className="relative bg-gradient-to-br from-blue-400 to-indigo-500 p-5 rounded-2xl mb-4 shadow-lg z-10"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Linkedin className="text-white w-10 h-10" />
            </motion.div>
            
            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 uppercase tracking-tight">
              One more step!
            </h2>
            <p className="text-gray-500 text-sm mt-2 flex items-center gap-2 font-medium">
              <Sparkles size={14} className="text-purple-400" /> 
              Verification Required
            </p>
          </div>

          <p className="text-gray-600 text-center text-sm mb-8 px-4 leading-relaxed">
            To ensure a fair election, please provide your **LinkedIn Profile URL** before entering the voting platform.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
              <input 
                type="url" 
                required 
                placeholder="https://linkedin.com/in/yourname"
                className="w-full bg-white/50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-400 transition-all shadow-inner"
                onChange={(e) => setUrl(e.target.value)} 
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-black rounded-xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? "PROCCESSING..." : (
                <>
                  SAVE & CONTINUE <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 flex justify-center items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            Verified Voting System
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;