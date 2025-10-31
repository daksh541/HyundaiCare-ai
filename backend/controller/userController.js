const User = require('../models/User');
const Referral = require('../models/Referral');
const ServiceBooking = require('../models/ServiceBooking');
const Valuation = require('../models/Valuation');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'User created successfully', user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !await user.validPassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, message: 'Login successful' });
};

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Referral, as: 'referrals' }, // Assumes association is set up
        { model: ServiceBooking, as: 'serviceBookings' },
        { model: Valuation, as: 'valuations' },
        // Could also include saved cars or other user data
      ]
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};