const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String }, // For local login
  linkedInProfile: { type: String, default: "#" }, // Mandatory for voter list links
  hasVoted: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);