const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  phone:     { type: String, default: '' },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['customer','staff','manager','admin','superadmin'], default: 'customer' },
  avatar:    { type: String, default: '' },
  addresses: [{
    label: String, line1: String, line2: String,
    city: String, state: String, pin: String, isDefault: Boolean
  }],
  wishlist:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive:  { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
