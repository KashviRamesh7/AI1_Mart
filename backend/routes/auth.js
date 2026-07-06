const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register (customers only via this route)
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ firstName, lastName, email, phone, password, role: 'customer' });
    res.status(201).json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, token: genToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login (all roles)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isActive)
      return res.status(403).json({ message: 'Account suspended' });
    user.lastLogin = new Date();
    await user.save();
    res.json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, token: genToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// Seed demo accounts
router.post('/seed', async (req, res) => {
  try {
    const accounts = [
      { firstName:'Super', lastName:'Admin', email:'superadmin@ai1mart.com', password:'admin123', role:'superadmin', phone:'9000000001' },
      { firstName:'Admin', lastName:'User', email:'admin@ai1mart.com', password:'admin123', role:'admin', phone:'9000000002' },
      { firstName:'Manager', lastName:'One', email:'manager@ai1mart.com', password:'admin123', role:'manager', phone:'9000000003' },
      { firstName:'Staff', lastName:'Member', email:'staff@ai1mart.com', password:'admin123', role:'staff', phone:'9000000004' },
      { firstName:'John', lastName:'Customer', email:'customer@ai1mart.com', password:'user123', role:'customer', phone:'9000000005' },
    ];
    for (const acc of accounts) {
      const exists = await User.findOne({ email: acc.email });
      if (!exists) await User.create(acc);
    }
    res.json({ message: 'Demo accounts seeded ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
