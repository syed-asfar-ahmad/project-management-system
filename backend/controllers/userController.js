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

    // Only update fields if they exist in the request
    if (req.body.bio) updateFields.bio = req.body.bio;
    if (req.body.gender) updateFields.gender = req.body.gender;
    if (req.body.dateOfBirth) updateFields.dateOfBirth = req.body.dateOfBirth;
    if (req.file) updateFields.profilePicture = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
