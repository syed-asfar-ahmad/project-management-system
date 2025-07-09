const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');

// GET only team members
router.get('/team-members', verifyToken, async (req, res) => {
  try {
    const teamMembers = await User.find({ role: 'Team Member' }).select('_id name email');
    res.json(teamMembers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

module.exports = router;
