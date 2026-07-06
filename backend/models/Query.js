const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  staff:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffName: String,
  type:      { type: String, enum: ['HR','Payroll','Technical','Schedule','Other'], default: 'Other' },
  subject:   { type: String, required: true },
  description: String,
  priority:  { type: String, enum: ['Low','Normal','Urgent'], default: 'Normal' },
  status:    { type: String, enum: ['open','in_progress','resolved'], default: 'open' },
  response:  String,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
