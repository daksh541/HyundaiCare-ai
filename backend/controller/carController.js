const Car = require('../models/Car');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Mock city tax rates (in %)
const cityTaxes = {
  Delhi: 10,
  Mumbai: 12,
  Bangalore: 11,
  Chennai: 10,
  // Add more cities
};

// Mock competitors (for each Hyundai model, list 2 competitors with mock data)
const competitors = {
  'GRAND i10 NIOS': [
    { model: 'Maruti Swift', price: '₹6.24 Lakh', mileage: '22 kmpl' },
    { model: 'Tata Punch', price: '₹6.13 Lakh', mileage: '20 kmpl' },
  ],
  // Add for other models similarly...
  'IONIQ 5': [
    { model: 'Kia EV6', price: '₹60.95 Lakh', range: '708 km' },
    { model: 'BYD Atto 3', price: '₹33.99 Lakh', range: '521 km' },
  ],
};

exports.getRecommendations = async (req, res) => {
  const { budget, familySize, commute, fuelType, preferences } = req.body;

  try {
    console.log('Request body:', req.body);
    // Rule-based filtering from DB
    const allCars = await Car.findAll();
    console.log('All cars from DB:', allCars);
    const filteredCars = allCars.filter(car => {
      try {
        const priceNum = parseFloat(car.starting_ex_showroom.replace('₹', '').replace(' Lakh', '')) * 100000;
        if (priceNum > budget) return false;
        if (familySize > 4 && car.category === 'Hatchback') return false;
        return true;
      } catch (err) {
        console.error('Error parsing price for car:', car, err);
        return false;
      }
    }).slice(0, 3); // Top 2-3

    // Calculate on-road price (assume city from query or default Delhi)
    const city = req.body.city || 'Delhi';
    const taxRate = cityTaxes[city] || 10;

    const recommendations = filteredCars.map(car => {
      try {
        const exShowroom = parseFloat(car.starting_ex_showroom.replace('₹', '').replace(' Lakh', '')) * 100000;
        const onRoad = exShowroom + (exShowroom * taxRate / 100);
        return {
          ...car.dataValues,
          starting_ex_showroom: car.starting_ex_showroom,
          on_road_price: `₹${(onRoad / 100000).toFixed(2)} Lakh`,
          competitors: competitors[car.model] || [],
        };
      } catch (err) {
        console.error('Error calculating on-road price for car:', car, err);
        return null;
      }
    }).filter(Boolean);

    console.log('Recommendations:', recommendations);

  // Disable OpenAI reasoning if quota is exceeded
  let reasoning = 'Reasoning feature is temporarily disabled due to OpenAI quota limits.';
  res.json({ recommendations, reasoning });
  } catch (error) {
    console.error('getRecommendations error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCars = async (req, res) => {
  const cars = await Car.findAll();
  res.json(cars);
};

// Admin CRUD
exports.createCar = async (req, res) => {
  // Check if admin via middleware
  const car = await Car.create(req.body);
  res.json(car);
};

// Similar for update, delete

//   const { Configuration, OpenAIApi } = require('openai');
//   const { Car } = require('../models');
//   require('dotenv').config();
// 
//   const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
//   });
//   const openai = new OpenAIApi(configuration);
// 
//   exports.getCars = async (req, res) => {
//     try {
//       const cars = await Car.findAll();
//       res.json(cars);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch cars' });
//     }
//   };
// 
//   exports.getCarById = async (req, res) => {
//     try {
//       const car = await Car.findByPk(req.params.id);
//       if (car) {
//         res.json(car);
//       } else {
//         res.status(404).json({ error: 'Car not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch car' });
//     }
//   };
// 
//   exports.recommendCars = async (req, res) => {
//     const { budget, familySize, dailyCommute, fuelType, preferences } = req.body;
//     try {
//       const cars = await Car.findAll();
//       const prompt = `
//         Given a budget of ${budget} INR, family size of ${familySize}, daily commute of ${dailyCommute} km,
//         fuel type preference of ${fuelType}, and user preferences: ${preferences},
//         recommend the top 3 Hyundai cars from the following list with reasons:
//         ${JSON.stringify(cars, null, 2)}
//       `;
//       const response = await openai.createChatCompletion({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//         max_tokens: 500,
//       });
//       res.json({
//         recommendations: response.data.choices[0].message.content,
//         cars: cars.filter(car => response.data.choices[0].message.content.includes(car.model)),
//       });
//     } catch (error) {
//       console.error('OpenAI Error:', error.response ? error.response.data : error.message);
//       res.status(500).json({ error: 'Failed to get recommendations' });
//     }
//   };
//   