const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

module.exports = function(upload) { 

  router.get('/', async (req, res) => {
    try {
      const events = await Event.find().sort({ dateTime: 1 });
      console.log('Events retrieved:', events);
      res.json(events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post('/', upload.single('coverImage'), async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden: Admin only' });

    const { title, dateTime, venue, description } = req.body;
    try {
      const eventData = { title, dateTime, venue, description };
      if (req.file) {
        eventData.coverImage = req.file.filename;
      }
      const event = new Event(eventData);
      await event.save();
      res.status(201).json({ message: 'Event created', event });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.put('/:id', upload.single('coverImage'), async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden: Admin only' });

    try {
      const updateData = { ...req.body };

      if (req.file) {
        updateData.coverImage = req.file.filename;
      }

      const updated = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updated) return res.status(404).json({ message: 'Event not found' });

      res.json({ message: 'Event updated', event: updated });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};