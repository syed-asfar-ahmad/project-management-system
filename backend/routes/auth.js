const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/auth');
const User = require('../models/User');

// Import OTP-related controllers
const { sendOtp } = require('../controllers/forgotPassword');

// Auth
router.post('/register', register);
router.post('/login', login);

// Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin-only route
router.get('/admin-data', verifyToken, checkRole('Admin'), (req, res) => {
  res.json({ message: 'Only admins can see this' });
});

// Get team members
router.get('/team-members', verifyToken, async (req, res) => {
  try {
    const teamMembers = await User.find({ role: 'Team Member' }).select('_id name email');
    res.json(teamMembers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// OTP & Password Reset
router.post('/forgot-password', sendOtp);

module.exports = router;
