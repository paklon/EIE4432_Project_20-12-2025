const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dateTime: { type: Date, required: true },
  venue: { type: String, required: true },
  description: String,
  coverImage: String,
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
