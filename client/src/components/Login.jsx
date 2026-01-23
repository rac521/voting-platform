import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Vote, ShieldCheck, Sparkles, Linkedin } from 'lucide-react';
import api from '../api'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // Fixed: Removed <string | null>

  const handleSubmit = async (e) => { // Fixed: Removed : React.FormEvent
    e.preventDefault();
    try {
      // Functional Logic: Linking to your specific backend route
      const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
      if (res.data.success) window.location.href = "/vote";
    } catch (err) { 
      alert("Login failed"); 
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://voting-platform-3soe.onrender.com/auth/google";
  };

  const handleLinkedInLogin = () => {
    window.location.href = "https://voting-platform-3soe.onrender.com/auth/linkedin";
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      {/* Dynamic floating background particles */}
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
                className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-50"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <motion.div 
                className="relative bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-5 rounded-2xl"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Vote className="w-12 h-12 text-white" />
              </motion.div>
            </div>

            <div className="text-center">
              <h2 className="text-4xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-bold">
                Welcome Back
              </h2>
              <p className="text-gray-600 flex items-center gap-2 justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Cast your vote securely
                <Sparkles className="w-4 h-4 text-pink-400" />
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email Address</label>
              <div className="relative bg-white rounded-xl">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-300 outline-none transition-all bg-gradient-to-r from-pink-50/50 to-purple-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Password</label>
              <div className="relative bg-white rounded-xl">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-300 outline-none transition-all bg-gradient-to-r from-blue-50/50 to-purple-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="/forgot-password" size={1.05} className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="w-full relative overflow-hidden rounded-xl py-4 group shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
              <span className="relative flex items-center justify-center gap-2 text-white font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>Login to Vote</span>
              </span>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {/* Google Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm"
            >
              {/* Gradient Tile for Google */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              <span>Google</span>
            </motion.button>

            {/* LinkedIn Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLinkedInLogin}
              className="flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-700 hover:border-blue-600 hover:bg-blue-50 transition-all shadow-sm"
            >
              {/* Gradient Tile for LinkedIn (Matches Complete Profile) */}
              <Linkedin className="text-blue-500 w-5 h-5" />
              <span>LinkedIn</span>
            </motion.button>
          </div>
          <p className="text-center pt-4 text-sm text-gray-600">
            Don't have an account? <a href="/signup" className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 font-bold">Sign up now</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login; // Proper export added here