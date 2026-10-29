const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'dukaan_khata_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (Customer or Owner)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, shopName, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const assignedRole = role === 'owner' ? 'owner' : 'customer';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      shopName: assignedRole === 'owner' ? (shopName || `${name}'s Store`) : undefined,
      phone: phone || '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        phone: user.phone,
        qrCodeImage: user.qrCodeImage || '',
        upiId: user.upiId || '',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
});

// @desc    Login user (Customer or Owner)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Find user with password included
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please try again.',
      });
    }

    // If a specific role was requested for login, verify it
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as '${user.role}', not as '${role}'. Please switch tab.`,
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        phone: user.phone,
        qrCodeImage: user.qrCodeImage || '',
        upiId: user.upiId || '',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
});

// @desc    Upload / Update QR code and UPI ID for shop owner
// @route   PUT /api/auth/qr
// @access  Private (Owner only)
router.put('/qr', protect, async (req, res) => {
  try {
    const { qrCodeImage, upiId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (qrCodeImage !== undefined) user.qrCodeImage = qrCodeImage;
    if (upiId !== undefined) user.upiId = upiId;

    await user.save();

    res.json({
      success: true,
      message: 'Shop QR code updated successfully.',
      qrCodeImage: user.qrCodeImage,
      upiId: user.upiId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update QR code: ' + error.message,
    });
  }
});

// @desc    Get QR code and UPI details for a specific shop
// @route   GET /api/auth/shop-qr/:shopName
// @access  Public
router.get('/shop-qr/:shopName', async (req, res) => {
  try {
    const owner = await User.findOne({
      role: 'owner',
      shopName: { $regex: new RegExp(`^${req.params.shopName}$`, 'i') }
    }).select('name shopName qrCodeImage upiId phone');

    if (!owner) {
      return res.status(404).json({ success: false, message: 'Shop owner not found' });
    }

    res.json({
      success: true,
      data: {
        shopName: owner.shopName,
        ownerName: owner.name,
        qrCodeImage: owner.qrCodeImage || '',
        upiId: owner.upiId || '',
        phone: owner.phone || '',
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
