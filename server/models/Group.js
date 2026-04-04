const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  nameMarathi: { type: String, default: '' },
  mainGroup:   { type: String, required: true, enum: ['IN', 'EX', 'AS', 'LI'] },
  isTotal:     { type: Boolean, default: false },
  societyCode: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Group', GroupSchema);
