// seedDatabase.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust the path as necessary
require('dotenv').config();

// Tenant configuration
const tenants = [
  {
    name: 'LogisticsCo',
    customerId: 'logisticsco',
    users: [
      {
        email: 'admin@logisticsco.com',
        password: 'LogisticsAdmin123!',
        role: 'Admin'
      },
      {
        email: 'driver1@logisticsco.com',
        password: 'Driver123!',
        role: 'User'
      },
      {
        email: 'dispatcher@logisticsco.com',
        password: 'Dispatch123!',
        role: 'User'
      }
    ]
  },
  {
    name: 'RetailGmbH',
    customerId: 'retailgmbh',
    users: [
      {
        email: 'admin@retailgmbh.de',
        password: 'RetailAdmin123!',
        role: 'Admin'
      },
      {
        email: 'cashier@retailgmbh.de',
        password: 'Cashier123!',
        role: 'User'
      },
      {
        email: 'manager@retailgmbh.de',
        password: 'Manager123!',
        role: 'User'
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected');

    // Clear existing data
    await User.deleteMany();
    console.log('Cleared existing users');

    // Seed users for each tenant
    for (const tenant of tenants) {
      console.log(`\nSeeding ${tenant.name} (${tenant.customerId})`);
      
      for (const userData of tenant.users) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const user = new User({
          email: userData.email,
          password: hashedPassword,
          customerId: tenant.customerId,
          role: userData.role,
          tenantId: tenant.customerId
        });

        await user.save();
        console.log(`Created ${userData.role} user: ${userData.email}`);
      }
    }

    console.log('\nSeed completed successfully!');
    console.log('Summary:');
    tenants.forEach(tenant => {
      console.log(`- ${tenant.name}: ${tenant.users.length} users created`);
    });
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();