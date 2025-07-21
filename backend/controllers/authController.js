const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register new user
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    console.log("Request body:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const matchStart = user.password.slice(0, 4);
    const matchEnd = user.password.slice(-4);

    const isPartialMatch = currentPassword.startsWith(matchStart) || currentPassword.endsWith(matchEnd);
    if (!isPartialMatch) {
      return res.status(403).json({ message: "Password pattern doesn't match" });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
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

const verifyPassword = async (req, res) => {
  const { email, currentPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ success: false, message: "User not found." });

  const hashed = user.password;
  const first4 = hashed.slice(0, 4);
  const last4 = hashed.slice(-4);

  if (
    currentPassword.slice(0, 4) === first4 ||
    currentPassword.slice(-4) === last4
  ) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: "Incorrect password." });
  }
};

module.exports = { register, login, changePassword, verifyPassword };
