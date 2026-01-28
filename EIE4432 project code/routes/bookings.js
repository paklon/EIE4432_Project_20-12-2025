const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');

router.post('/', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });

  const { eventId, seatIds, paymentInfo } = req.body;
  try {
    const seats = await Seat.find({ _id: { $in: seatIds }, status: 'available', eventId });
    if (seats.length !== seatIds.length) return res.status(400).json({ message: 'Some seats are no longer available' });

    const totalCost = seats.reduce((sum, s) => sum + s.price, 0);
    const paymentSuccess = true;

    if (paymentSuccess) {
      await Seat.updateMany({ _id: { $in: seatIds } }, { status: 'booked', buyerInfo: req.session.user._id });
      const booking = new Booking({
        userId: req.session.user._id,
        eventId,
        seats: seatIds,
        totalCost,
        paymentStatus: 'success',
        transactionDate: new Date()
      });
      await booking.save();
      res.json({ message: 'Booking successful', booking });
    } else {
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/history', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const bookings = await Booking.find({ userId: req.session.user._id }).populate('eventId').populate('seats');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
