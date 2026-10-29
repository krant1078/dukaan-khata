const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const seedInitialData = require('./config/seeder');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// Connect to MongoDB Database
connectDB().then(() => {
  seedInitialData();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname)); // Also serves files in root folder like web.html

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);

// Route shortcuts
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Dukaan Khata Backend Server Running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🔐 Login Page: http://localhost:${PORT}/login.html`);
  console.log(`🛍️ App Dashboard: http://localhost:${PORT}/index.html`);
  console.log(`===============================================`);
});
