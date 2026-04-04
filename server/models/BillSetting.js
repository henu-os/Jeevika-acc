const mongoose = require('mongoose');

const BillSettingSchema = new mongoose.Schema({
  id:             { type: String, required: true },
  name:           { type: String, required: true },
  shortName:      { type: String, default: '' },
  accountCode:    { type: String, default: '' },
  gstApplicable:  { type: Boolean, default: false },
  gstExempt:      { type: Boolean, default: false },
  societyCode:    { type: String, required: true },
}, { timestamps: true });

BillSettingSchema.index({ id: 1, societyCode: 1 }, { unique: true });

module.exports = mongoose.model('BillSetting', BillSettingSchema);
