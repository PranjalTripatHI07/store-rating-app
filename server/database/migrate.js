const sequelize = require('./config');
const { User, Store, Rating } = require('../models');
require('dotenv').config();

async function migrate() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');

    // Create admin user
    await User.create({
      name: 'System Administrator',
      email: 'admin@storerating.com',
      password: 'Admin@123',
      address: 'Admin Office, Main Building',
      role: 'admin'
    });
    console.log('Admin user created successfully');

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrate(); 