const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createNotificationsForUsers } = require('./notificationController');

// Register new user
const register = async (req, res) => {
  const { name, email, password, position, gender } = req.body;
  const role = "Team Member";

  try {
    console.log("Request body:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role, position, gender });
    await user.save();

    // Notify all admins about new user registration
    const admins = await User.find({ role: { $in: ['Admin', 'Manager'] } });
    if (admins.length > 0) {
      const adminIds = admins.map(admin => admin._id);
      
      const notificationTitle = 'New User Registered';
      const notificationMessage = `A new user "${name}" (${email}) has registered as a ${role}`;
      
      await createNotificationsForUsers(
        adminIds,
        user._id, // Use the new user's ID as sender
        'member_added',
        notificationTitle,
        notificationMessage
      );
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { register, login };
