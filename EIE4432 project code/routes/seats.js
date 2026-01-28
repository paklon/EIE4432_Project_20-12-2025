const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat');

router.get('/:eventId', async (req, res) => {
  try {
    let query = { eventId: req.params.eventId };
    if(req.query.floor !== undefined){
      query.floor = Number(req.query.floor);
    }
    const seats = await Seat.find(query);
    res.json(seats);
  } catch (err) {
    console.error('Failed to load seats:', err);
    res.status(500).json({ message: 'Failed to load seats', error: err.message });
  }
});

router.post('/:eventId', async (req, res) => {
  if(!req.session.user || req.session.user.role !== 'admin'){
    return res.status(403).json({ message: 'Forbidden: Admin only' });
  }
  try {
    const seats = req.body.seats;
    if(!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Seats array is required' });
    }
    const createdSeats = await Seat.insertMany(seats);
    res.status(201).json({ message: 'Seats created', seats: createdSeats });
  } catch(err) {
    console.error('Failed to create seats:', err);
    res.status(500).json({ message: err.message });
  }
});

router.put('/:seatId', async (req, res) => {
  if(!req.session.user || req.session.user.role !== 'admin'){
    return res.status(403).json({ message: 'Forbidden: Admin only' });
  }
  try {
    const seat = await Seat.findByIdAndUpdate(req.params.seatId, req.body, { new: true });
    if(!seat) return res.status(404).json({ message: 'Seat not found' });
    res.json({ message: 'Seat updated', seat });
  } catch(err) {
    console.error('Failed to update seat:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
