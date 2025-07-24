const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const updateFields = {};
    const { bio, gender, dateOfBirth, position, name } = req.body;

    if (bio) updateFields.bio = bio;
    if (gender) updateFields.gender = gender;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
    if (position) updateFields.position = position;
    if (name) updateFields.name = name;

    if (req.file && req.file.path) {
      updateFields.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err); 
    res.status(500).json({ message: "Failed to update profile" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.json(users);
  } catch (err) {
    console.error('Failed to fetch users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};


exports.updateUserRole = async (req, res) => {
  const { userId, newRole } = req.body;

  // Only allow 'Team Member' or 'Manager'
  const allowedRoles = ['Team Member', 'Manager'];
  if (!allowedRoles.includes(newRole)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = newRole;
    await user.save();

    res.status(200).json({ message: `Role updated to ${newRole}` });
  } catch (err) {
    console.error("Role update error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


