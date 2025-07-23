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
    console.log("🟡 Incoming update request body:", req.body);
    console.log("🟡 Uploaded file:", req.file); // Important log

    const updateFields = {};
    const { bio, gender, dateOfBirth, position, name } = req.body;

    if (bio) updateFields.bio = bio;
    if (gender) updateFields.gender = gender;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
    if (position) updateFields.position = position;
    if (name) updateFields.name = name;


    if (req.file && req.file.path) {
      updateFields.profilePicture = req.file.path; // optional fallback
    } else if (req.file && req.file.filename && req.file.path === undefined && req.file.url) {
      updateFields.profilePicture = req.file.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("🔥 Update profile error:", err); // this should show up
    res.status(500).json({ message: "Failed to update profile" });
  }
};
