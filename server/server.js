const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Strategy: LinkedInStrategy } = require('passport-linkedin-oauth2');

const User = require('./models/User');
const Candidate = require('./models/Candidate');
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');

const app = express();
app.set('trust proxy', 1);

// --- 1. Middleware Stack ---
app.use(express.json());
app.use(cors({ 
  origin: process.env.FRONTEND_URL , 
  credentials: true 
}));
app.use(session({ 
    secret: "voting_secret", 
    resave: false, 
    saveUninitialized: false,
    proxy: true, // MUST be true for Render/Vercel
    cookie: { 
        secure: true, // MUST be true for HTTPS (Render provides this)
        sameSite: 'none', // MUST be 'none' for Vercel -> Render communication
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    } 
}));

app.use(passport.initialize());
app.use(passport.session());

// --- 2. Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch(err => console.error("DB Connection Error:", err));

// --- 3. Passport Serialization ---
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

// --- 4. Google Strategy ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          linkedInProfile: "#", 
          hasVoted: false
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// --- 5. LinkedIn Strategy (Standardized OIDC) ---
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "/auth/linkedin/callback",
    scope: ['openid', 'profile', 'email'], 
    state: true
  }, 
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = (profile.emails && profile.emails[0]) ? profile.emails[0].value : profile.email;
      const name = profile.displayName || `${profile.name.givenName} ${profile.name.familyName}`;

      if (!email) return done(new Error("No email found"), null);

      let user = await User.findOne({ email: email });
      if (!user) {
        user = await User.create({
          name: name,
          email: email,
          linkedInProfile: "#",
          hasVoted: false
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// --- 6. API Routes & Auth Bridge ---
app.get("/auth/login/success", (req, res) => {
  if (req.user) {
    const needsProfileUpdate = !req.user.linkedInProfile || 
                               req.user.linkedInProfile === "#" || 
                               req.user.linkedInProfile.includes("profile/view?id=");
    res.status(200).json({ success: true, user: req.user, needsProfileUpdate });
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

app.post("/api/user/update-linkedin", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  try {
    await User.findByIdAndUpdate(req.user._id, { linkedInProfile: req.body.linkedInProfile });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

app.get("/api/candidates", async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch candidates" });
    }
});

app.use("/auth", authRoutes);
app.use("/api/vote", voteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));