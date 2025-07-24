const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/auth'); 
const upload = require('../middleware/upload'); 
const User = require('../models/User');

const {
  updateUserProfile,
  getUserProfile,
  getAllUsers
} = require('../controllers/userController');

// GET only team members
router.get('/team-members', verifyToken, async (req, res) => {
  try {
    const teamMembers = await User.find({ role: 'Team Member' }).select('_id name email');
    res.json(teamMembers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// GET profile (protected)
router.get('/profile', verifyToken, getUserProfile);

// PUT profile (with image)
router.put('/profile', verifyToken, upload.single('profilePicture'), updateUserProfile);

router.get('/', verifyToken, (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
}, getAllUsers);



module.exports = router;
