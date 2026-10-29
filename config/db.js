const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dukaan_khata');
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️ Tip: Ensure MongoDB service is running (e.g., net start MongoDB or open MongoDB Compass).');
    process.exit(1);
  }
};

module.exports = connectDB;
