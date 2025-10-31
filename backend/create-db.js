const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    // Connect without specifying a database
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '25052006'
    });

    // Create the database
    await connection.execute('CREATE DATABASE IF NOT EXISTS hyundai_ai_db');
    console.log('Database hyundai_ai_db created successfully!');

    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error.message);
  }
}

createDatabase();
