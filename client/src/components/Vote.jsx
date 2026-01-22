// Ensure this is used for EVERY request
const api = axios.create({ 
  baseURL: "https://voting-platform-3soe.onrender.com",
  withCredentials: true // Essential for cross-domain cookies
});
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Linkedin, Sparkles, User, Home, Trophy, Users, TrendingUp } from "lucide-react";
import axios from "axios";

const Vote = () => {
  const [user, setUser] = useState(null);
  const [voted, setVoted] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [showVotersList, setShowVotersList] = useState(false);
  const listRef = useRef(null);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        // Use your standardized 'api' instance here
        const authRes = await api.get("/auth/login/success");

        if (authRes.data.needsProfileUpdate) {
          window.location.href = "/complete-profile";
          return;
        }
        
        setUser(authRes.data.user);
        if (authRes.data.user.hasVoted) setVoted(true); 

        // Fetch other data through the same authenticated instance
        const [candRes, voterRes] = await Promise.all([
          api.get("/api/candidates"),
          api.get("/api/vote/voters")
        ]);

        setCandidates(candRes.data);
        setVoters(voterRes.data);
          
      } catch (err) {
        console.error("Session missing or expired:", err);
        // This is what is kicking you back to the login page
        window.location.href = "/"; 
      }
    };
    checkAuthAndFetch();
  }, []);

  const handleVote = async (candidateName) => {
      try {
          // Use 'api' instance for the POST request
          await api.post("/api/vote/cast", { userId: user._id, candidateName });
          setVoted(true); 
          
          const res = await api.get("/api/vote/voters");
          setVoters(res.data);
      } catch (err) { 
          alert("Error casting vote."); 
      }
  };
  
  // useEffect(() => {
  //   const checkAuthAndFetch = async () => {
  //     try {
  //       // Corrected: withCredentials is now inside the config object
  //       const authRes = await api.get("https://voting-platform-3soe.onrender.com/auth/login/success", { 
  //         withCredentials: true 
  //       });

  //       if (authRes.data.needsProfileUpdate) {
  //         window.location.href = "/complete-profile";
  //         return;
  //       }
        
  //       setUser(authRes.data.user);
  //       if (authRes.data.user.hasVoted) setVoted(true); 

  //       // Apply to other GET requests too
  //       const candRes = await axios.get("https://voting-platform-3soe.onrender.com/api/candidates", { 
  //         withCredentials: true 
  //       });
  //       setCandidates(candRes.data);

  //       const voterRes = await axios.get("https://voting-platform-3soe.onrender.com/api/vote/voters", { 
  //         withCredentials: true 
  //       });
  //       setVoters(voterRes.data);
        
  //     } catch (err) {
  //       window.location.href = "/"; 
  //     }
  //   };
  //   checkAuthAndFetch();
  // }, []);

  // const handleVote = async (candidateName) => {
  //   try {
  //     await axios.post("https://voting-platform-3soe.onrender.com/api/vote/cast", { userId: user._id, candidateName }, { withCredentials: true });
  //     setVoted(true); 
  //     const res = await axios.get("https://voting-platform-3soe.onrender.com/api/vote/voters", { withCredentials: true });
  //     setVoters(res.data);
  //   } catch (err) { alert("Error casting vote."); }
  // };

  return (
    <div className="w-full max-w-4xl mx-auto relative z-10 p-6 space-y-6">
      {[...Array(10)].map((_, i) => (
        <motion.div key={i} className="absolute w-2 h-2 rounded-full" style={{ background: ['#FFB6C1', '#DDA0DD', '#ADD8E6', '#FFDAB9'][i % 4], left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ y: [0, -50, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 5 + i, repeat: Infinity }} />
      ))}

      {!voted ? (
        /* --- VOTING VIEW --- */
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-10 border border-white/40">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <motion.div className="relative bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-4 rounded-2xl shadow-xl" whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}>
                <User className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 uppercase">Voting Portal</h1>
                <p className="text-gray-500 font-medium italic">Welcome, {user?.name}</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => window.location.href = "https://voting-platform-3soe.onrender.com/auth/logout"} className="px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-bold border border-red-100 flex items-center gap-2">
              <LogOut size={20} /> Logout
            </motion.button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {candidates.map((c) => (
              <motion.div key={c._id} whileHover={{ y: -10 }} className="p-8 bg-white rounded-[2.5rem] border-2 border-pink-50 shadow-xl flex flex-col items-center text-center group transition-all hover:border-purple-300">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
                  <img 
                    // Ensure 'photo' matches your Schema exactly
                    src={c.photo && c.photo.startsWith('data:image') 
                      ? c.photo 
                      : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + c.name} 
                    alt={c.name} 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg relative z-10 object-cover"
                    onError={(e) => {
                      console.error("Base64 string is invalid");
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-1">{c.name}</h3>
                <p className="text-purple-600 font-bold text-sm mb-4">{c.role || "Candidate"}</p>
                
                {/* FIX: Using linkedInUrl to match your schema screenshot */}
                <motion.a 
                  href={c.linkedInUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }} 
                  className="flex items-center gap-2 text-blue-600 font-black text-xs mb-8 hover:underline uppercase tracking-widest"
                >
                  <Linkedin size={16} /> LinkedIn Profile
                </motion.a>
                
                <motion.button onClick={() => handleVote(c.name)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-black rounded-2xl shadow-xl uppercase">Cast Vote</motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        /* --- CONGRATULATIONS VIEW --- */
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white/80 backdrop-blur-3xl rounded-[3rem] shadow-2xl p-16 border border-white/40 text-center overflow-hidden">
            <div className="relative mb-10 inline-block">
              <motion.div className="absolute inset-0 -m-8" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}><div className="w-full h-full rounded-full border-4 border-dashed border-pink-300/40" /></motion.div>
              <motion.div className="relative bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 p-10 rounded-[2.5rem] shadow-2xl" whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}>
                <Trophy className="w-20 h-20 text-white" />
              </motion.div>
            </div>
            <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4 tracking-tighter">SUCCESS!</h1>
            <h2 className="text-3xl text-gray-800 font-bold mb-10 italic">Thank you for voting, {user?.name}</h2>
            <div className="flex flex-col sm:flex-row gap-5 justify-center max-w-lg mx-auto">
              <motion.button onClick={() => window.location.href = "/"} whileHover={{ scale: 1.05 }} className="flex-1 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl">
                <Home size={20} /> Home
              </motion.button>
              <motion.button onClick={() => setShowVotersList(!showVotersList)} whileHover={{ scale: 1.05 }} className={`flex-1 py-5 border-4 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all ${showVotersList ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-purple-100 text-purple-600'}`}>
                <Users size={20} /> {showVotersList ? "Hide Voters" : "Voters List"}
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showVotersList && (
              <motion.div 
                ref={listRef}
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white shadow-2xl overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-purple-100 rounded-2xl"><TrendingUp className="text-purple-600" /></div>
                    <h3 className="text-3xl font-black text-gray-800 tracking-tight uppercase">Verified Participation</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {voters.map((v, i) => (
                    <motion.a 
                    key={i} 
                    href={v.linkedInProfile} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-pink-50 hover:border-purple-400 transition-all group hover:shadow-lg"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 text-white flex items-center justify-center text-sm font-black">
                        {v.name?.charAt(0)}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-sm font-black text-gray-800 truncate group-hover:text-purple-600">
                        {v.name}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          Verified Member
                        </span>
                      </div>
                      <Linkedin size={14} className="ml-auto text-blue-400 opacity-20 group-hover:opacity-100" />
                    </motion.a>
                  ))}
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Vote;