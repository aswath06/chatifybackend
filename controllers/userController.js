const { User } = require('../models');
const nodemailer = require('nodemailer');

// Temporary OTP storage
const otpStore = {};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'maswath55@gmail.com',
    pass: process.env.EMAIL_PASS || 'crnc tmlg bivw zafy'
  }
});

// ---------- CRUD Operations ---------- //

// Create User
exports.createUser = async (req, res) => {
  try {
    const { name, username, email, profileImg, dateOfBirth } = req.body;
    const user = await User.create({ name, username, email, profileImg, dateOfBirth });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { name, username, email, profileImg, dateOfBirth } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ name, username, email, profileImg, dateOfBirth });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------- Email Verification ---------- //

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Email not registered' });

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // 10 min expiry

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otpStore[email]) return res.status(400).json({ error: 'OTP expired or not sent' });

    const stored = otpStore[email];
    if (Date.now() > stored.expires) {
      delete otpStore[email];
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (stored.otp === otp) {
      delete otpStore[email]; // OTP verified, remove from store
      res.json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
