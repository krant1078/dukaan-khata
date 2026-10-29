const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  shop: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['in', 'low', 'out'],
    default: 'in',
  },
  unit: {
    type: String,
    default: '',
    trim: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Product', productSchema);
