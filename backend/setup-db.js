const mysql = require('mysql2/promise');

async function setupDatabase() {
  try {
    // Connect without specifying a database
    let connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '25052006'
    });

    // Create the database
    await connection.execute('CREATE DATABASE IF NOT EXISTS hyundaicare_db');
    console.log('Database hyundaicare_db created successfully!');

    // Close the connection and reconnect to the specific database
    await connection.end();
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '25052006',
      database: 'hyundaicare_db'
    });

    // Drop tables if they exist to recreate with new schema
    await connection.execute('DROP TABLE IF EXISTS matches');
    await connection.execute('DROP TABLE IF EXISTS valuations');
    await connection.execute('DROP TABLE IF EXISTS service_bookings');
    await connection.execute('DROP TABLE IF EXISTS referrals');
    await connection.execute('DROP TABLE IF EXISTS spare_parts');
    await connection.execute('DROP TABLE IF EXISTS cars');
    await connection.execute('DROP TABLE IF EXISTS users');
    console.log('Old tables dropped successfully!');

    // Create tables one by one
    await connection.execute(`CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      preferences JSON,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
    console.log('Users table created successfully!');

    await connection.execute(`CREATE TABLE cars (
      id INT AUTO_INCREMENT PRIMARY KEY,
      make VARCHAR(255) DEFAULT 'Hyundai',
      model VARCHAR(255) NOT NULL,
      year INT,
      resaleValue DECIMAL(10,2),
      serviceDetails TEXT,
      meta JSON,
      category VARCHAR(255) NOT NULL,
      starting_ex_showroom VARCHAR(255) NOT NULL,
      model_page VARCHAR(255),
      image_url VARCHAR(255),
      key_features TEXT,
      typical_accessories TEXT,
      notes TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
    console.log('Cars table created successfully!');

    await connection.execute(`CREATE TABLE spare_parts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      car_id INT,
      part_name VARCHAR(255) NOT NULL,
      price VARCHAR(255) NOT NULL,
      FOREIGN KEY (car_id) REFERENCES cars(id)
    )`);
    console.log('Spare parts table created successfully!');

    await connection.execute(`CREATE TABLE referrals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      points INT DEFAULT 0,
      referrals_count INT DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
    console.log('Referrals table created successfully!');

    await connection.execute(`CREATE TABLE service_bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      dealer VARCHAR(255),
      date_time DATETIME,
      communication_channel ENUM('Call', 'Email', 'WhatsApp', 'SMS'),
      description TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
    console.log('Service bookings table created successfully!');

    await connection.execute(`CREATE TABLE valuations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      model VARCHAR(255),
      year INT,
      kms INT,
      city VARCHAR(255),
      accident_history BOOLEAN,
      service_history BOOLEAN,
      estimated_value VARCHAR(255),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
    console.log('Valuations table created successfully!');

    await connection.execute(`CREATE TABLE matches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      suggestedCarId INT NOT NULL,
      userPreferences JSON NOT NULL,
      companyOfferedResale DECIMAL(10,2),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (suggestedCarId) REFERENCES cars(id)
    )`);
    console.log('Matches table created successfully!');

    console.log('All tables created successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error setting up database:', error.message);
  }
}

setupDatabase();
