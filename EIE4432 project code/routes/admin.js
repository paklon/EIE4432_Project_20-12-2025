const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');

router.get('/users', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/transactions', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });
  try {
    const bookings = await Booking.find().populate('userId').populate('eventId').populate('seats');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
