const express = require('express');
const User = require('../models/User');

module.exports = function(upload) {
  const router = express.Router();

  router.post('/register', upload.single('profileImage'), async (req, res) => {
    try {
      const { userId, password, nickname, email, gender, birthdate } = req.body;
      if (!userId || !password || !email ) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const existing = await User.findOne({ $or: [{ userId }, { email }] });
      if (existing) {
        return res.status(400).json({ message: 'User ID or Email already exists' });
      }

      const user = new User({ userId, nickname, email, gender, birthdate, role: 'user' });
      if (req.file) {
        user.profileImage = req.file.filename;
      }
      await user.setPassword(password);
      await user.save();

      res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post('/login', async (req, res) => {
    const { userId, password } = req.body;

    if (userId === 'admin' && password === 'adminpass') {
      req.session.user = { userId: 'admin', role: 'admin' };
      return res.json({ message: 'Admin login successful', role: 'admin' });
    }

    try {
      const user = await User.findOne({ userId });
      if (!user) throw Error('Invalid credentials');

      const valid = await user.validatePassword(password);
      if (!valid) throw Error('Invalid credentials');

      req.session.user = { _id: user._id, userId: user.userId, role: user.role };
      res.json({ message: 'Login successful', role: user.role });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ message: 'Logged out successfully' }));
  });
  
  router.get('/profile', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const user = await User.findById(req.session.user._id).select('-passwordHash');
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


  router.put('/profile', upload.single('profileImage'), async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const user = await User.findById(req.session.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const { nickname, email, password } = req.body;

      if (nickname) user.nickname = nickname;
      if (email) user.email = email;

      if (password) await user.setPassword(password);

      if (req.file) {
        user.profileImage = req.file.filename;
      }

      await user.save();

      res.json({ message: 'Profile updated successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};
