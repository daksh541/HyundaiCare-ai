const SparePart = require('../models/SparePart');
const ServiceBooking = require('../models/ServiceBooking');

exports.getSpareParts = async (req, res) => {
  const { carId } = req.query; // Changed from modelId to carId for clarity
  try {
    const parts = await SparePart.findAll({ where: { car_id: carId } });
    if (parts.length === 0) {
      return res.status(404).json({ message: 'No spare parts found for this car model.' });
    }
    res.json(parts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bookService = async (req, res) => {
  try {
    const { dealer, date_time, communication_channel, description } = req.body;
    const booking = await ServiceBooking.create({
      dealer,
      date_time,
      communication_channel,
      description,
      user_id: req.user.id // Now correctly linking the booking to the user
    });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};