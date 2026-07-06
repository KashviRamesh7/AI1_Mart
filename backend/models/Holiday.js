const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  staff:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffName: String,
  type:      { type: String, enum: ['Annual','Sick','Emergency','Unpaid'], default: 'Annual' },
  from:      { type: Date, required: true },
  to:        { type: Date, required: true },
  days:      Number,
  reason:    String,
  contact:   String,
  status:    { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewNote: String
}, { timestamps: true });

module.exports = mongoose.model('Holiday', holidaySchema);
