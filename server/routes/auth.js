const bcrypt = require("bcryptjs");
const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// --- Local Auth: SIGNUP with Hashing ---
router.post("/signup", async (req, res) => {
    const { name, email, password, linkedInProfile } = req.body;
    try {
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword, // Store the hash, not the plain text
            linkedInProfile 
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Email already exists or server error" });
    }
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "No account found with this email." });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:5173/reset-password/${user._id}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Your Voting Platform Password",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Password Reset Request</h2>
                    <p>Hello ${user.name},</p>
                    <p>Click the button below to reset your password. This link is valid for a limited time.</p>
                    <a href="${resetLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "A reset link has been sent to your Gmail!" });

    } catch (err) {
        console.error("Nodemailer Error:", err);
        res.status(500).json({ error: "Failed to send email. Check your App Password." });
    }
});

// Route to handle the password update
router.post("/reset-password/:id", async (req, res) => {
    const { password } = req.body;
    try {
        // Hash the new password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password in MongoDB
        await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
        
        res.json({ success: true, message: "Password updated successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to reset password." });
    }
});

// --- Local Auth: LOGIN with Verification ---
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        // Compare the provided password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        req.login(user, (err) => {
            if (err) return res.status(500).json({ error: "Login failed" });
            res.json({ success: true, user });
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// --- Google Auth ---
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", 
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/" }),
    (req, res) => res.redirect("https://voting-platform-cyan.vercel.app/vote")
);

// --- LinkedIn Auth ---
router.get("/linkedin", passport.authenticate("linkedin", { 
    scope: ['openid', 'profile', 'email'] 
}));
router.get("/linkedin/callback", 
    passport.authenticate("linkedin", { 
        failureRedirect: "http://localhost:5173/",
        successRedirect: "https://voting-platform-cyan.vercel.app/vote" 
    })
);

// --- LOGOUT (Fixing the "Cannot GET /auth/logout") ---
// Ensure this route is precisely /logout and that server.js uses app.use("/auth", authRoutes)
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie("connect.sid"); 
            // Important: Use an absolute URL for redirect to ensure it leaves the API domain
            return res.redirect("http://localhost:5173/"); 
        });
    });
});

module.exports = router;