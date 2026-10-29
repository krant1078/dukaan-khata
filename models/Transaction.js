const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  customerName: {
    type: String,
    default: 'Walk-in Customer',
  },
  amount: {
    type: Number,
    required: true,
  },
  utrNumber: {
    type: String,
    default: '',
  },
  productName: {
    type: String,
    default: 'General Store Purchase',
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'paid',
  },
  paymentMethod: {
    type: String,
    default: 'UPI QR',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
