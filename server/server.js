/* ════════════════════════════════════════════════════════════════
   JEEVIKA ACCOUNTING — MONGODB REST API SERVER v1.0
   Stack: Express + Mongoose
   Port: 3456 (configurable via .env)
   ════════════════════════════════════════════════════════════════ */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3456;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// ─── MongoDB Connection ──────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jeevika_accounting')
  .then(() => console.log('✅ MongoDB connected — Database: jeevika_accounting'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('⚠️  Server will run with localStorage fallback mode');
  });

// ─── Models ──────────────────────────────────────────────
const Society    = require('./models/Society');
const Group      = require('./models/Group');
const Account    = require('./models/Account');
const Member     = require('./models/Member');
const BillSetting = require('./models/BillSetting');
const GSTMapping = require('./models/GSTMapping');

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ════════════════════════════════════════════════════════════
// SOCIETY ROUTES
// ════════════════════════════════════════════════════════════

app.get('/api/societies', async (req, res) => {
  try {
    const societies = await Society.find().sort({ createdAt: -1 });
    res.json(societies);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/societies/:code', async (req, res) => {
  try {
    const society = await Society.findOne({ code: req.params.code });
    if (!society) return res.status(404).json({ error: 'Society not found' });
    res.json(society);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/societies', async (req, res) => {
  try {
    const society = new Society(req.body);
    await society.save();
    res.status(201).json(society);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Society code already exists' });
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/societies/:code', async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    const society = await Society.findOneAndUpdate(
      { code: req.params.code }, req.body, { new: true, runValidators: true }
    );
    if (!society) return res.status(404).json({ error: 'Society not found' });
    res.json(society);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/societies/:code', async (req, res) => {
  try {
    const result = await Society.findOneAndDelete({ code: req.params.code });
    if (!result) return res.status(404).json({ error: 'Society not found' });
    res.json({ message: 'Society deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Set active society
app.post('/api/societies/:code/activate', async (req, res) => {
  try {
    await Society.updateMany({}, { isActive: false });
    const society = await Society.findOneAndUpdate(
      { code: req.params.code }, { isActive: true }, { new: true }
    );
    if (!society) return res.status(404).json({ error: 'Society not found' });
    res.json(society);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Share Capital sub-route ──
app.put('/api/societies/:code/share-capital', async (req, res) => {
  try {
    const society = await Society.findOneAndUpdate(
      { code: req.params.code },
      { shareCapital: req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!society) return res.status(404).json({ error: 'Society not found' });
    res.json(society.shareCapital);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── Balance Sheet Footer sub-route ──
app.put('/api/societies/:code/balance-sheet-footer', async (req, res) => {
  try {
    const society = await Society.findOneAndUpdate(
      { code: req.params.code },
      { balanceSheetFooter: req.body.lines, updatedAt: new Date() },
      { new: true }
    );
    if (!society) return res.status(404).json({ error: 'Society not found' });
    res.json(society.balanceSheetFooter);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── Billing Remarks sub-routes ──
app.put('/api/societies/:code/billing-remarks-col1', async (req, res) => {
  try {
    const society = await Society.findOneAndUpdate(
      { code: req.params.code },
      { billingRemarksCol1: req.body.lines, linewiseRemark: req.body.linewiseRemark, updatedAt: new Date() },
      { new: true }
    );
    if (!society) return res.status(404).json({ error: 'Society not found' });
    res.json({ lines: society.billingRemarksCol1, linewiseRemark: society.linewiseRemark });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/societies/:code/billing-remarks-col2', async (req, res) => {
  try {
    const society = await Society.findOneAndUpdate(
      { code: req.params.code },
      { billingRemarksCol2: req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!society) return res.status(404).json({ error: 'Society not found' });
    res.json(society.billingRemarksCol2);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── Signatures sub-route ──
app.put('/api/societies/:code/signatures', async (req, res) => {
  try {
    const society = await Society.findOneAndUpdate(
      { code: req.params.code },
      { signatures: req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!society) return res.status(404).json({ error: 'Society not found' });
    res.json(society.signatures);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── Blast Panel sub-route ──
app.put('/api/societies/:code/blast-panel', async (req, res) => {
  try {
    const society = await Society.findOneAndUpdate(
      { code: req.params.code },
      { blastPanel: req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!society) return res.status(404).json({ error: 'Society not found' });
    res.json(society.blastPanel);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════════
// GROUP ROUTES
// ════════════════════════════════════════════════════════════

app.get('/api/groups', async (req, res) => {
  try {
    const filter = req.query.societyCode ? { societyCode: req.query.societyCode } : {};
    res.json(await Group.find(filter).sort({ mainGroup: 1, code: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/groups', async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/groups/:code', async (req, res) => {
  try {
    const group = await Group.findOneAndUpdate({ code: req.params.code }, req.body, { new: true });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/groups/:code', async (req, res) => {
  try {
    await Group.findOneAndDelete({ code: req.params.code });
    res.json({ message: 'Group deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════════
// ACCOUNT ROUTES
// ════════════════════════════════════════════════════════════

app.get('/api/accounts', async (req, res) => {
  try {
    const filter = req.query.societyCode ? { societyCode: req.query.societyCode } : {};
    res.json(await Account.find(filter).sort({ code: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/accounts', async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/accounts/:code', async (req, res) => {
  try {
    const account = await Account.findOneAndUpdate({ code: req.params.code }, req.body, { new: true });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/accounts/:code', async (req, res) => {
  try {
    await Account.findOneAndDelete({ code: req.params.code });
    res.json({ message: 'Account deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════════
// MEMBER ROUTES
// ════════════════════════════════════════════════════════════

app.get('/api/members', async (req, res) => {
  try {
    const filter = req.query.societyCode ? { societyCode: req.query.societyCode } : {};
    res.json(await Member.find(filter).sort({ code: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/members', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/members/:code', async (req, res) => {
  try {
    const member = await Member.findOneAndUpdate({ code: req.params.code }, req.body, { new: true });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/members/:code', async (req, res) => {
  try {
    await Member.findOneAndDelete({ code: req.params.code });
    res.json({ message: 'Member deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════════
// BILL SETTING ROUTES
// ════════════════════════════════════════════════════════════

app.get('/api/bill-settings', async (req, res) => {
  try {
    const filter = req.query.societyCode ? { societyCode: req.query.societyCode } : {};
    res.json(await BillSetting.find(filter));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/bill-settings/bulk', async (req, res) => {
  try {
    const { settings, societyCode } = req.body;
    for (const s of settings) {
      await BillSetting.findOneAndUpdate(
        { id: s.id, societyCode },
        { ...s, societyCode },
        { upsert: true, new: true }
      );
    }
    res.json({ message: 'Bill settings saved', count: settings.length });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════════
// GST MAPPING ROUTES
// ════════════════════════════════════════════════════════════

app.get('/api/gst-mappings', async (req, res) => {
  try {
    const filter = req.query.societyCode ? { societyCode: req.query.societyCode } : {};
    res.json(await GSTMapping.find(filter));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/gst-mappings', async (req, res) => {
  try {
    const mapping = new GSTMapping(req.body);
    await mapping.save();
    res.status(201).json(mapping);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/gst-mappings/:id', async (req, res) => {
  try {
    const mapping = await GSTMapping.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mapping) return res.status(404).json({ error: 'GST Mapping not found' });
    res.json(mapping);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/gst-mappings/:id', async (req, res) => {
  try {
    await GSTMapping.findByIdAndDelete(req.params.id);
    res.json({ message: 'GST Mapping deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ════════════════════════════════════════════════════════════
// MIGRATION: localStorage → MongoDB
// ════════════════════════════════════════════════════════════

app.post('/api/migrate', async (req, res) => {
  try {
    const { type, data } = req.body;
    let result;
    switch (type) {
      case 'societies':
        result = await Society.insertMany(data, { ordered: false }).catch(e => ({ errors: e.message }));
        break;
      case 'groups':
        result = await Group.insertMany(data, { ordered: false }).catch(e => ({ errors: e.message }));
        break;
      case 'accounts':
        result = await Account.insertMany(data, { ordered: false }).catch(e => ({ errors: e.message }));
        break;
      case 'members':
        result = await Member.insertMany(data, { ordered: false }).catch(e => ({ errors: e.message }));
        break;
      default:
        return res.status(400).json({ error: 'Unknown type: ' + type });
    }
    res.json({ message: 'Migration complete', result });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Start ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏢 Jeevika Accounting Server v1.0`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🌐 App: http://localhost:${PORT}`);
  console.log(`📁 Serving: ${path.join(__dirname, '..')}\n`);
});
