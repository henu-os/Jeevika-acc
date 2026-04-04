const mongoose = require('mongoose');

const ParkingDetailSchema = new mongoose.Schema({
  type:      { type: String, enum: ['2W', '4W'], default: '4W' },
  slotNo:    { type: String, default: '' },
  vehicleNo: { type: String, default: '' },
  charges:   { type: Number, default: 0 },
}, { _id: false });

const MemberSchema = new mongoose.Schema({
  code:             { type: String, required: true, unique: true },
  groupName:        { type: String, default: 'Dues from Members' },
  names:            [{ type: String }],
  building:         { type: String, default: '' },
  wing:             { type: String, default: '' },
  flatNo:           { type: String, default: '' },
  sqft:             { type: Number, default: 0 },
  areaType:         { type: String, enum: ['RERA', 'MOFA', 'CIDCO', 'MHADA'], default: 'RERA' },
  openingPrincipal: { type: Number, default: 0 },
  openingInterest:  { type: Number, default: 0 },
  contactNo:        { type: String, default: '' },
  email:            { type: String, default: '' },
  gstin:            { type: String, default: '' },
  pan:              { type: String, default: '' },
  loanDetails:      { type: String, default: '' },
  bankName:         { type: String, default: '' },
  nocApplicable:    { type: Boolean, default: false },
  parkingDetails:   [ParkingDetailSchema],
  defaultRemarks:   { type: String, default: '' },
  // Share allotment
  sharesAllotted:   { type: Number, default: 0 },
  shareCertNo:      { type: String, default: '' },
  societyCode:      { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);
