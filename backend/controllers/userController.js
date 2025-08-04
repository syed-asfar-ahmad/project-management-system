const User = require('../models/User');
const { createNotification } = require('./notificationController');

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
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateFields = {};
    const { bio, gender, dateOfBirth, position, name, profilePicture } = req.body;

    // Store original values for comparison
    const originalName = user.name;
    const originalPosition = user.position;
    const originalProfilePicture = user.profilePicture;

    if (bio) updateFields.bio = bio;
    if (gender) updateFields.gender = gender;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
    if (position) updateFields.position = position;
    if (name) updateFields.name = name;

    // Accept Vercel Blob image URL
    if (profilePicture) {
      updateFields.profilePicture = profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    ).select('-password');

    // Create notifications for profile updates
    const userName = updatedUser.name;

    // Notification for name change
    if (name && name !== originalName) {
      const notificationTitle = 'Profile Name Updated';
      const notificationMessage = `Your profile name has been updated from "${originalName}" to "${userName}"`;
      
      await createNotification(
        req.user.id,
        req.user.id,
        'member_added',
        notificationTitle,
        notificationMessage
      );
    }

    // Notification for position change
    if (position && position !== originalPosition) {
      const notificationTitle = 'Profile Position Updated';
      const notificationMessage = `Your position has been updated to "${position}"`;
      
      await createNotification(
        req.user.id,
        req.user.id,
        'member_added',
        notificationTitle,
        notificationMessage
      );
    }

    // Notification for profile picture change
    if (profilePicture && profilePicture !== originalProfilePicture) {
      const notificationTitle = 'Profile Picture Updated';
      const notificationMessage = 'Your profile picture has been updated';
      
      await createNotification(
        req.user.id,
        req.user.id,
        'member_added',
        notificationTitle,
        notificationMessage
      );
    }

    // Notification for other profile updates
    if (bio || gender || dateOfBirth) {
      const notificationTitle = 'Profile Updated';
      const notificationMessage = 'Your profile information has been updated';
      
      await createNotification(
        req.user.id,
        req.user.id,
        'member_added',
        notificationTitle,
        notificationMessage
      );
    }

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


