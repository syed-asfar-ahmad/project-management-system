const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/auth');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);


router.get('/admin-data', verifyToken, checkRole('Admin'), (req, res) => {
  res.json({ message: 'Only admins can see this' });
});

router.get('/team-members', verifyToken, async (req, res) => {
  try {
    const teamMembers = await User.find({ role: 'Team Member' }).select('_id name email');
    res.json(teamMembers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});


module.exports = router;
