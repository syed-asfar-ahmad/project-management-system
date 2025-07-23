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
    console.error("🔥 Update profile error:", err); 
    res.status(500).json({ message: "Failed to update profile" });
  }
};
