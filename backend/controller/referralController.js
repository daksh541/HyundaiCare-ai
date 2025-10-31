// Save a new referral
exports.addReferral = async (req, res) => {
  const { name, email, phone, referralCode } = req.body;
  try {
    const referral = await Referral.create({ name, email, phone, referralCode, user_id: req.user ? req.user.id : null });
    res.json(referral);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all referrals for a user
exports.getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.findAll({ where: { user_id: req.user ? req.user.id : null } });
    res.json(referrals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const Referral = require('../models/Referral');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.playQuiz = async (req, res) => {
  // Generate quiz using OpenAI
  const prompt = 'Generate a short 3-question quiz on Hyundai cars. Provide questions and correct answers.';
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });
  const quiz = JSON.parse(completion.choices[0].message.content); // Assume JSON output

  res.json(quiz);
};

exports.submitQuiz = async (req, res) => {
  const { answers } = req.body;
  // Mock scoring: assume correct answers from session or something
  const score = 50; // Points earned
  let referral = await Referral.findOne({ where: { user_id: req.user.id } });
  if (!referral) referral = await Referral.create({ user_id: req.user.id });
  referral.points += score;
  await referral.save();

  res.json({ points: referral.points });
};

exports.getLeaderboard = async (req, res) => {
  const leaders = await Referral.findAll({
    include: ['User'],
    order: [['points', 'DESC']],
    limit: 10,
  });
  res.json(leaders);
};

// Redeem points - mock
exports.redeemPoints = (req, res) => {
  // Deduct points, give discount code
  res.json({ discount: '10% off service' });
};