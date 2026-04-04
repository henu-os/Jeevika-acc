const mongoose = require('mongoose');

/* ═══════════════════════════════════════════════════════════
   SOCIETY SCHEMA — Complete Society/Company Master
   Includes: Profile, Share Capital, Balance Sheet Footer,
   Billing Remarks (Col1 & Col2), Signatures, Blast Panel
   ═══════════════════════════════════════════════════════════ */

const ShareCapitalSchema = new mongoose.Schema({
  totalShares:     { type: Number, default: 0 },
  valuePerShare:   { type: Number, default: 0 },
  totalAmount:     { type: Number, default: 0 },
  paidUpShares:    { type: Number, default: 0 },
  paidUpAmount:    { type: Number, default: 0 },
}, { _id: false });

const BalanceSheetFooterLineSchema = new mongoose.Schema({
  text:   { type: String, default: '' },
  bold:   { type: Boolean, default: false },
  align:  { type: String, enum: ['left', 'center', 'right'], default: 'left' },
}, { _id: false });

const BillingRemarkLineSchema = new mongoose.Schema({
  text:   { type: String, default: '' },
  bold:   { type: Boolean, default: false },
}, { _id: false });

const SignatureSchema = new mongoose.Schema({
  chairmanName:    { type: String, default: '' },
  chairmanLabel:   { type: String, default: 'Chairman' },
  secretaryName:   { type: String, default: '' },
  secretaryLabel:  { type: String, default: 'Hon. Secretary' },
  treasurerName:   { type: String, default: '' },
  treasurerLabel:  { type: String, default: 'Hon. Treasurer' },
  showOnBills:     { type: Boolean, default: true },
  showOnReports:   { type: Boolean, default: true },
  showOnReceipts:  { type: Boolean, default: true },
}, { _id: false });

const BillingRemarksCol2Schema = new mongoose.Schema({
  lines:                   [BillingRemarkLineSchema],
  notPrintOnHalfPageBill:  { type: Boolean, default: false },
  printIn2Columns:         { type: Boolean, default: true },
}, { _id: false });

const BlastPanelSchema = new mongoose.Schema({
  enabled:          { type: Boolean, default: false },
  whatsappEnabled:  { type: Boolean, default: false },
  emailEnabled:     { type: Boolean, default: false },
  smsEnabled:       { type: Boolean, default: false },
  pushEnabled:      { type: Boolean, default: false },
  defaultMessage:   { type: String, default: '' },
  lastBlastDate:    { type: Date },
  blastHistory:     [{ date: Date, type: String, count: Number, status: String }],
}, { _id: false });

const SocietySchema = new mongoose.Schema({
  // — Core Identity —
  code:                 { type: String, required: true, unique: true, uppercase: true },
  name:                 { type: String, required: true },
  registrationNo:       { type: String, default: '' },
  address:              { type: String, default: '' },
  city:                 { type: String, default: '' },
  state:                { type: String, default: 'Maharashtra' },
  pincode:              { type: String, default: '' },
  email:                { type: String, default: '' },
  contactNo:            { type: String, default: '' },
  website:              { type: String, default: '' },
  
  // — Tax IDs —
  gstin:                { type: String, default: '' },
  pan:                  { type: String, default: '' },
  tan:                  { type: String, default: '' },
  
  // — Configuration —
  areaUnit:             { type: String, enum: ['sqft', 'sqmtr'], default: 'sqft' },
  financialYearStart:   { type: String, default: '' },
  financialYearEnd:     { type: String, default: '' },
  
  // — Interest Settings —
  interestMethod:       { type: String, default: 'monthly' },
  interestType:         { type: String, enum: ['simple', 'compound'], default: 'simple' },
  interestRate:         { type: Number, default: 21, max: 21 },
  interestPriority:     { type: String, enum: ['interest_first', 'principal_first'], default: 'interest_first' },
  
  // — Billing Settings —
  billingMethod:        { type: String, enum: ['monthly', 'quarterly', 'annual'], default: 'monthly' },
  billDate:             { type: Number, default: 1, min: 1, max: 28 },
  dueDate:              { type: Number, default: 20, min: 1, max: 28 },
  gstEnabled:           { type: Boolean, default: false },
  
  // ═══ RIGHT PANEL SECTIONS ═══
  
  // — 1. Authorised Share Capital —
  shareCapital:         { type: ShareCapitalSchema, default: () => ({}) },
  
  // — 2. Balance Sheet Footer (up to 6 lines) —
  balanceSheetFooter:   { type: [BalanceSheetFooterLineSchema], default: () => [] },
  
  // — 3. Billing Remarks Column 1 (up to 8 lines) —
  billingRemarksCol1:   { type: [BillingRemarkLineSchema], default: () => [] },
  linewiseRemark:       { type: Boolean, default: true },
  
  // — 4. Billing Remarks Column 2 —
  billingRemarksCol2:   { type: BillingRemarksCol2Schema, default: () => ({}) },
  
  // — 5. Bank Details —
  bankDetails:          { type: String, default: '' },
  bankName:             { type: String, default: '' },
  bankBranch:           { type: String, default: '' },
  bankAccountNo:        { type: String, default: '' },
  bankIFSC:             { type: String, default: '' },
  upiId:                { type: String, default: '' },
  chequeInstructions:   { type: String, default: '' },
  
  // — 6. Signature / Authority —
  signatures:           { type: SignatureSchema, default: () => ({}) },
  
  // — 7. Blast Panel —
  blastPanel:           { type: BlastPanelSchema, default: () => ({}) },
  
  // — Meta —
  isActive:             { type: Boolean, default: false },
  createdAt:            { type: Date, default: Date.now },
  updatedAt:            { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Society', SocietySchema);
