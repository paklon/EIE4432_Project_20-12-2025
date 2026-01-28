const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  seatNumber: { type: String, required: true },
  floor: { type: Number, required: true },
  status: { type: String, enum: ['available', 'booked', 'disabled'], default: 'available' },
  priceTier: { type: String, enum: ['economy', 'premium'], required: true },
  price: { type: Number, required: true }, // Price for this exact seat (from selected tier)
  buyerInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Populated when booked
}, { timestamps: true });

module.exports = mongoose.model('Seat', SeatSchema);
