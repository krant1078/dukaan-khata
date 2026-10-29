const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth.middleware');

// @desc    Simulate and record a QR scan payment
// @route   POST /api/payments/scan-pay
// @access  Public or Authenticated
router.post('/scan-pay', async (req, res) => {
  try {
    const { shop, amount, customerName, utrNumber, productName } = req.body;

    const transaction = await Transaction.create({
      shop: shop || 'Sharma General Store',
      amount: Number(amount) || 410,
      customerName: customerName || (req.user ? req.user.name : 'Walk-in Customer'),
      utrNumber: utrNumber || `UPI-${Date.now().toString().slice(-6)}`,
      productName: productName || 'General Store Purchase',
      status: 'paid',
      paymentMethod: 'UPI QR',
    });

    res.status(201).json({
      success: true,
      message: 'Payment successfully captured via UPI QR.',
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment simulation failed: ' + error.message,
    });
  }
});

// @desc    Get recent transaction ledger history for a shop or customer
// @route   GET /api/payments/history
// @access  Public or Authenticated
router.get('/history', async (req, res) => {
  try {
    const { shop, customerName } = req.query;
    let query = {};
    if (shop) {
      query.shop = { $regex: new RegExp(`^${shop}$`, 'i') };
    }
    if (customerName) {
      query.customerName = { $regex: new RegExp(`^${customerName}$`, 'i') };
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 }).limit(25);
    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get Owner dashboard summary stats
// @route   GET /api/payments/owner-stats
// @access  Public
router.get('/owner-stats', async (req, res) => {
  try {
    const { shop } = req.query;
    const shopName = shop || 'Sharma General Store';

    const transactions = await Transaction.find({
      shop: { $regex: new RegExp(`^${shopName}$`, 'i') },
      status: 'paid'
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalOrders = transactions.length;

    const inCount = await Product.countDocuments({ shop: shopName, status: 'in' });
    const lowCount = await Product.countDocuments({ shop: shopName, status: 'low' });
    const outCount = await Product.countDocuments({ shop: shopName, status: 'out' });

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue + 3420, // baseline + real
        totalOrders: totalOrders + 14,
        inStock: inCount,
        lowStock: lowCount,
        outStock: outCount,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get dashboard metrics & stats for Admin/Owner
// @route   GET /api/payments/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const shopsCount = await User.countDocuments({ role: 'owner' });
    const customersCount = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    
    // Calculate total transactions
    const transactions = await Transaction.find({ status: 'paid' });
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    // Get list of shops for admin view
    const shopOwners = await User.find({ role: 'owner' }).select('name email shopName status createdAt');

    res.json({
      success: true,
      stats: {
        registeredShops: Math.max(shopsCount, 4), // Fallback baseline for demo
        customerAccounts: Math.max(customersCount, 12),
        totalProducts,
        todaysPayments: totalRevenue + 58200, // Include baseline sample
      },
      shops: shopOwners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats: ' + error.message,
    });
  }
});

module.exports = router;
