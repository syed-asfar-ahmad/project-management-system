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
    const { name, bio, gender, dateOfBirth } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateFields = {
      name,
      bio,
      gender,
      dateOfBirth,
    };

    if (profilePicture) {
      updateFields.profilePicture = profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
