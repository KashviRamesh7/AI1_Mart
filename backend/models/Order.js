const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, emoji: String, price: Number, qty: Number
  }],
  address: {
    name: String, phone: String, line1: String, line2: String,
    city: String, state: String, pin: String
  },
  payment: {
    method: { type: String, default: 'COD' },
    status: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
    transactionId: String
  },
  subtotal:   Number,
  discount:   { type: Number, default: 0 },
  delivery:   { type: Number, default: 0 },
  total:      Number,
  status: {
    type: String,
    enum: ['pending','confirmed','processing','packed','shipped','out_for_delivery','delivered','cancelled','returned'],
    default: 'pending'
  },
  trackingId:   String,
  deliveryAgent: String,
  estimatedDelivery: Date,
  notes:        String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
