const mongoose = require('mongoose');

const GSTMappingSchema = new mongoose.Schema({
  accountCode:     { type: String, default: '' },
  gstRate:         { type: Number, default: 18 },
  cgstRate:        { type: Number, default: 9 },
  sgstRate:        { type: Number, default: 9 },
  cgstAccount:     { type: String, default: '' },
  sgstAccount:     { type: String, default: '' },
  exemptionLimit:  { type: Number, default: 0 },
  rounding:        { type: String, enum: ['none', 'round', 'ceil', 'floor'], default: 'none' },
  societyCode:     { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('GSTMapping', GSTMappingSchema);
