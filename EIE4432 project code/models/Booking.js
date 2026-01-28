const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  seats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seat' }],
  totalCost: Number,
  paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  transactionDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
