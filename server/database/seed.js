const { User, Store, Rating } = require('../models');
require('dotenv').config();

async function seed() {
  try {
    // Create sample users
    const storeOwner1 = await User.create({
      name: 'Store Owner One Sample Name Here',
      email: 'owner1@example.com',
      password: 'Owner@123',
      address: '123 Store Street, City',
      role: 'store_owner'
    });

    const storeOwner2 = await User.create({
      name: 'Store Owner Two Sample Name Here',
      email: 'owner2@example.com',
      password: 'Owner@123',
      address: '456 Shop Avenue, Town',
      role: 'store_owner'
    });

    const normalUser1 = await User.create({
      name: 'Normal User One Sample Name Here',
      email: 'user1@example.com',
      password: 'User@123',
      address: '789 User Lane, Village',
      role: 'user'
    });

    const normalUser2 = await User.create({
      name: 'Normal User Two Sample Name Here',
      email: 'user2@example.com',
      password: 'User@123',
      address: '101 Customer Road, County',
      role: 'user'
    });

    // Create sample stores
    const store1 = await Store.create({
      name: 'First Sample Store Name Here',
      email: 'store1@example.com',
      address: '111 Retail Plaza, Shopping District',
      ownerId: storeOwner1.id
    });

    const store2 = await Store.create({
      name: 'Second Sample Store Name Here',
      email: 'store2@example.com',
      address: '222 Market Street, Downtown',
      ownerId: storeOwner2.id
    });

    const store3 = await Store.create({
      name: 'Third Sample Store Name Here',
      email: 'store3@example.com',
      address: '333 Commerce Boulevard, Uptown',
      ownerId: storeOwner1.id
    });

    // Create sample ratings
    await Rating.create({
      rating: 4,
      userId: normalUser1.id,
      storeId: store1.id
    });

    await Rating.create({
      rating: 5,
      userId: normalUser1.id,
      storeId: store2.id
    });

    await Rating.create({
      rating: 3,
      userId: normalUser2.id,
      storeId: store1.id
    });

    await Rating.create({
      rating: 2,
      userId: normalUser2.id,
      storeId: store3.id
    });

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed(); 