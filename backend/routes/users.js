const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/auth'); 
const upload = require('../middleware/upload'); 
const User = require('../models/User');
const { getAllUsers } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const {
  updateUserProfile,
  getUserProfile
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


router.get("/", protect, getAllUsers); 



module.exports = router;

