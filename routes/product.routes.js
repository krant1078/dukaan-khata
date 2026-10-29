const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth.middleware');

// @desc    Get all products (with optional search and shop filters)
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, shop, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shop: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (shop) {
      query.shop = shop;
    }

    if (status) {
      query.status = status;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products: ' + error.message,
    });
  }
});

// @desc    Add a new product
// @route   POST /api/products
// @access  Private (Owner or Admin)
router.post('/', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const { name, price, status, unit, category } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product name and price are required.',
      });
    }

    const shopName = req.user.shopName || req.body.shop || 'General Store';

    const product = await Product.create({
      name,
      shop: shopName,
      ownerId: req.user._id,
      price: Number(price),
      status: status || 'in',
      unit: unit || '',
      category: category || 'Groceries',
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add product: ' + error.message,
    });
  }
});

// @desc    Update product details / status (in, low, out)
// @route   PUT /api/products/:id
// @access  Private (Owner or Admin)
router.put('/:id', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Ensure the owner owns this product (unless admin)
    if (req.user.role !== 'admin' && product.ownerId && product.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only manage products for your own shop.',
      });
    }

    const { name, price, status, unit } = req.body;
    if (name) product.name = name;
    if (price !== undefined) product.price = Number(price);
    if (status) product.status = status;
    if (unit !== undefined) product.unit = unit;

    await product.save();

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product: ' + error.message,
    });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Owner or Admin)
router.delete('/:id', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    if (req.user.role !== 'admin' && product.ownerId && product.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete products from your own store.',
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product: ' + error.message,
    });
  }
});

module.exports = router;
