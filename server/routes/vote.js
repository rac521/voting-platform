const router = require('express').Router();
const User = require('../models/User');
const Candidate = require("../models/Candidate");

// 1. Get all voters (Who has voted)
router.get('/voters', async (req, res) => {
  const voters = await User.find({ hasVoted: true });
  res.json(voters);
});

// 2. Get the current vote counts for all candidates
router.get('/results', async (req, res) => {
  const results = await Candidate.find();
  res.json(results);
});

// 3. Cast a vote (The logic you were missing)
router.post('/cast', async (req, res) => {
  const { userId, candidateName } = req.body; // Added candidateName here
  
  try {
    const user = await User.findById(userId);
    
    if (user.hasVoted) {
      return res.status(400).json({ message: "Already voted!" });
    }

    // Step A: Mark user as voted
    user.hasVoted = true;
    await user.save();

    // Step B: Increment the candidate's vote count
    // { $inc: { voteCount: 1 } } tells MongoDB to add 1 to the existing number
    await Candidate.findOneAndUpdate(
      { name: candidateName }, 
      { $inc: { voteCount: 1 } }, 
      { upsert: true, new: true } // upsert: true creates the candidate if they don't exist
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error during voting" });
  }
});

module.exports = router;