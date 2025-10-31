const Valuation = require('../models/Valuation');
const Car = require('../models/Car');

exports.estimateResale = async (req, res) => {
  const { model, year, kms, city, accidentHistory, serviceHistory, photos } = req.body;

  // Fetch original price from the Car model or a mock source
  const carData = await Car.findOne({ where: { model: model } });
  const originalPrice = carData ? parseFloat(carData.starting_ex_showroom.replace(/[^0-9.]/g, '')) * 100000 : 800000;

  const age = new Date().getFullYear() - year;
  let value = originalPrice * Math.pow(0.85, age); // Basic depreciation

  // Adjustments with more detail
  value -= (kms / 1000) * 150; // -₹150 per 1000 km
  if (accidentHistory) value *= 0.75; // 25% deduction for accident history
  if (serviceHistory) value *= 1.1; // 10% bonus for service history

  // City-based market factor (mock data)
  const cityMarketFactor = {
    'Delhi': 1.05,
    'Mumbai': 1.1,
    'Bangalore': 1.0,
    'Chennai': 0.95,
  };
  value *= cityMarketFactor[city] || 1.0;

  const range = `${(value * 0.9).toFixed(0)} - ${(value * 1.1).toFixed(0)}`;
  const listingPrice = value.toFixed(0);
  const tips = [
    'Maintain service records to prove vehicle history.',
    'Fix any minor damages to increase visual appeal.',
    'Thoroughly clean and detail the car before listing.',
    'Highlight any aftermarket accessories or upgrades.'
  ];
  if (serviceHistory) {
    tips.push('Your service history is a major plus, make sure to show it to potential buyers.');
  }
  if (accidentHistory) {
    tips.push('Be transparent about the accident history. It is better to disclose it upfront.');
  }

  try {
    // Save to DB
    await Valuation.create({
      model, year, kms, city, accident_history: accidentHistory, service_history: serviceHistory,
      estimated_value: range, photos, user_id: req.user.id
    });
  } catch (error) {
    console.error('Failed to save valuation:', error);
  }

  res.json({ estimatedValue: range, listingPrice, tips });
};