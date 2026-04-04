const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  code:               { type: String, required: true, unique: true },
  name:               { type: String, required: true },
  nameBSheet:         { type: String, default: '' },
  nameSecondLang:     { type: String, default: '' },
  groupCode:          { type: String, required: true },
  mainGroup:          { type: String, default: '' },
  openingBalance:     { type: Number, default: 0 },
  openingBalanceType: { type: String, enum: ['Dr', 'Cr'], default: 'Dr' },
  prevYearBalance:    { type: Number, default: 0 },
  address:            { type: String, default: '' },
  contactNo:          { type: String, default: '' },
  email:              { type: String, default: '' },
  pan:                { type: String, default: '' },
  tan:                { type: String, default: '' },
  gstin:              { type: String, default: '' },
  societyCode:        { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Account', AccountSchema);
