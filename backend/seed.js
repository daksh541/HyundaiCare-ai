const sequelize = require('./config/db');
const Car = require('./models/Car');
const SparePart = require('./models/SparePart');
const User = require('./models/User');
const Valuation = require('./models/Valuation');
const ServiceBooking = require('./models/ServiceBooking');
const Referral = require('./models/Referral');
const Match = require('./models/Match');

const carData = [
  {
    model: "GRAND i10 NIOS",
    category: "Hatchback",
    starting_ex_showroom: "₹5.98 Lakh",
    model_page: "https://www.hyundai.com/in/en/find-a-car/grand-i10-nios/highlights",
    image_url: "https://www.hyundai.com/content/dam/hyundai/in/en/find-a-car/grand-i10-nios/exterior.jpg",
    key_features: "20.25 cm touchscreen, Hy-CNG option, AMT/MT, 4 airbags, ABS with EBD, ESC",
    typical_accessories: "Floor mats, seat covers, infotainment upgrade, alloy wheels",
    notes: "Good city car; company-fitted Hy-CNG available.",
    fuel_type: "Petrol, CNG",
    seating_capacity: 5
  },
  {
    model: "i20",
    category: "Hatchback",
    starting_ex_showroom: "₹7.04 Lakh",
    model_page: "https://www.hyundai.com/in/en/find-a-car/i20/highlights",
    image_url: "https://www.hyundai.com/content/dam/hyundai/in/en/find-a-car/i20/exterior.jpg",
    key_features: "6 airbags, Bose premium sound system, sunroof, D-Cut steering wheel, Puddle lamps, ADAS",
    typical_accessories: "Wireless charger, sport pedal kit, door visors",
    notes: "Premium hatchback with advanced features.",
    fuel_type: "Petrol",
    seating_capacity: 5
  },
  {
    model: "CRETA",
    category: "SUV",
    starting_ex_showroom: "₹11 Lakh",
    model_page: "https://www.hyundai.com/in/en/find-a-car/creta/highlights",
    image_url: "https://www.hyundai.com/content/dam/hyundai/in/en/find-a-car/creta/exterior.jpg",
    key_features: "Panoramic sunroof, ventilated seats, 10.25 inch infotainment, 6 airbags, ADAS, 360-degree camera",
    typical_accessories: "Side steps, rear spoiler, dashcam",
    notes: "The best-selling SUV in the segment.",
    fuel_type: "Petrol, Diesel",
    seating_capacity: 5
  },
  {
    model: "VENUE",
    category: "SUV",
    starting_ex_showroom: "₹8.04 Lakh",
    model_page: "https://www.hyundai.com/in/en/find-a-car/venue/highlights",
    image_url: "https://www.hyundai.com/content/dam/hyundai/in/en/find-a-car/venue/exterior.jpg",
    key_features: "Connected car tech, 6 airbags, sunroof, ADAS, Turbo GDi engine",
    typical_accessories: "Chrome kit, body graphics, rear seat entertainment",
    notes: "Compact SUV, ideal for city and highway.",
    fuel_type: "Petrol, Diesel",
    seating_capacity: 5
  },
  {
    model: "ALCAZAR",
    category: "MPV",
    starting_ex_showroom: "₹16.78 Lakh",
    model_page: "https://www.hyundai.com/in/en/find-a-car/alcazar/highlights",
    image_url: "https://www.hyundai.com/content/dam/hyundai/in/en/find-a-car/alcazar/exterior.jpg",
    key_features: "6/7 seater option, panoramic sunroof, ventilated seats, 3rd row AC",
    typical_accessories: "Roof rails, luggage carrier, sun shades",
    notes: "Family-friendly MPV with premium features.",
    fuel_type: "Petrol, Diesel",
    seating_capacity: 7
  },
  {
    model: "TUCSON",
    category: "SUV",
    starting_ex_showroom: "₹29.02 Lakh",
    model_page: "https://www.hyundai.com/in/en/find-a-car/tucson/highlights",
    image_url: "https://www.hyundai.com/content/dam/hyundai/in/en/find-a-car/tucson/exterior.jpg",
    key_features: "Premium SUV, AWD option, advanced safety (ADAS), hybrid",
    typical_accessories: "HUD upgrade, premium audio, tow hook",
    notes: "Luxury segment SUV.",
    fuel_type: "Petrol, Diesel",
    seating_capacity: 5
  },
  {
    model: "IONIQ 5",
    category: "EV",
    starting_ex_showroom: "₹46.05 Lakh",
    model_page: "https://www.hyundai.com/in/en/find-a-car/ioniq-5/highlights",
    image_url: "https://www.hyundai.com/content/dam/hyundai/in/en/find-a-car/ioniq-5/exterior.jpg",
    key_features: "Electric crossover, 631 km range, fast charging, V2L, advanced ADAS suite, 6 airbags, Ncap 5-star",
    typical_accessories: "Charging cable, home charger, mats",
    notes: "Flagship EV.",
    fuel_type: "Electric",
    seating_capacity: 5
  }
];

const sparePartsData = [
  { car_id: 1, part_name: "Brake Pads - GRAND i10 NIOS", price: "₹1500", stock_quantity: 50, supplier: 'Bosch' },
  { car_id: 1, part_name: "Oil Filter - GRAND i10 NIOS", price: "₹500", stock_quantity: 120, supplier: 'Mann' },
  { car_id: 12, part_name: "EV Battery - IONIQ 5", price: "₹800000", stock_quantity: 5, supplier: 'LG Chem' }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Disable foreign key checks to allow dropping tables with dependencies
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Sync all models to the database
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Insert data
    await Car.bulkCreate(carData);
    await SparePart.bulkCreate(sparePartsData);
    console.log('Data seeded successfully!');

    // Create a dummy user for testing
    const dummyUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    console.log(`Dummy user created with ID: ${dummyUser.id}`);

    // Create an admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@hyundai.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log(`Admin user created with ID: ${adminUser.id}`);

    // Create sample cars with admin fields
    const sampleCars = [
      {
        make: 'Hyundai',
        model: 'Creta',
        year: 2023,
        resaleValue: 850000,
        serviceDetails: 'Free 3 yrs service',
        meta: { mileage: '12kmpl' }
      },
      {
        make: 'Hyundai',
        model: 'Venue',
        year: 2023,
        resaleValue: 750000,
        serviceDetails: 'Free 2 yrs service',
        meta: { mileage: '15kmpl' }
      }
    ];
    await Car.bulkCreate(sampleCars);
    console.log('Sample cars with admin fields created');
    
  } catch (error) {
    console.error('Unable to connect to the database or seed data:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

seed();