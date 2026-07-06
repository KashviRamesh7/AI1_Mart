const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category:    { type: String, required: true },
  subcategory: { type: String, default: '' },
  brand:       { type: String, default: '' },
  price:       { type: Number, required: true },
  salePrice:   { type: Number },
  stock:       { type: Number, default: 0 },
  sku:         { type: String, sparse: true },
  emoji:       { type: String, default: '📦' },
  imageUrl:    { type: String, default: '' },
  images:      [String],
  features:    [String],
  tags:        [String],
  rating:      { type: Number, default: 4.0 },
  numReviews:  { type: Number, default: 0 },
  reviews: [{
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name:    String,
    rating:  Number,
    comment: String,
    date:    Date,
  }],
  status:    { type: String, enum: ['active','draft','out_of_stock'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
