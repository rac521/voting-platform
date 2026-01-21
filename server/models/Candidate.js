const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String }, // This is your photo field
  role: { type: String, default: "Candidate" }, // Added to show on card
  linkedInUrl: { type: String, required: true }, // Ensure this exact name matches frontend
  voteCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Candidate", CandidateSchema);