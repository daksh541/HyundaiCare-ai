require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    // Sync models to the database. `force: false` to avoid dropping tables on every run.
    return sequelize.sync({ force: false });
  })
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to the database or sync models:', err);
  });
