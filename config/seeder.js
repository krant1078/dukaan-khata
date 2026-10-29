const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const seedInitialData = async () => {
  try {
    // 1. Seed Demo Owner if not exists
    let demoOwner = await User.findOne({ email: 'owner@sharma.com' });
    if (!demoOwner) {
      demoOwner = await User.create({
        name: 'R. Sharma',
        email: 'owner@sharma.com',
        password: 'password123',
        role: 'owner',
        shopName: 'Sharma General Store',
        phone: '+91 98765 43210',
      });
      console.log('✅ Demo Owner created: owner@sharma.com / password123');
    }

    // 2. Seed Demo Customer if not exists
    const demoCustomer = await User.findOne({ email: 'customer@gmail.com' });
    if (!demoCustomer) {
      await User.create({
        name: 'Amit Patel',
        email: 'customer@gmail.com',
        password: 'password123',
        role: 'customer',
        phone: '+91 91234 56789',
      });
      console.log('✅ Demo Customer created: customer@gmail.com / password123');
    }

    // 3. Seed Sample Products if product collection is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const initialProducts = [
        { name: 'Toor Dal (1 kg)', shop: 'Sharma General Store', ownerId: demoOwner._id, price: 142, status: 'in', category: 'Pulses' },
        { name: 'Sunflower Oil (1 L)', shop: 'Sharma General Store', ownerId: demoOwner._id, price: 168, status: 'low', category: 'Oils' },
        { name: 'Basmati Rice (5 kg)', shop: 'Sharma General Store', ownerId: demoOwner._id, price: 410, status: 'out', category: 'Grains' },
        { name: 'Amul Milk (500 ml)', shop: 'Sharma General Store', ownerId: demoOwner._id, price: 32, status: 'in', category: 'Dairy' },
        { name: 'Tata Salt (1 kg)', shop: 'Sharma General Store', ownerId: demoOwner._id, price: 28, status: 'in', category: 'Spices' },
        { name: 'Maggi Noodles (pack of 4)', shop: 'Verma Kirana Store', price: 96, status: 'in', category: 'Snacks' },
        { name: 'Basmati Rice (5 kg)', shop: 'Verma Kirana Store', price: 425, status: 'in', category: 'Grains' },
        { name: 'Colgate Toothpaste (150g)', shop: 'Iyer Family Mart', price: 54, status: 'low', category: 'Personal Care' },
      ];
      await Product.insertMany(initialProducts);
      console.log('✅ Initial stock ledger products populated.');
    }
  } catch (err) {
    console.error('Seeder notice:', err.message);
  }
};

module.exports = seedInitialData;
