const router = require('express').Router();
const User = require('../models/User');
const { protect, roles } = require('../middleware/auth');

router.get('/', protect, roles('manager','admin','superadmin'), async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['staff','manager','admin','superadmin'] } }).select('-password').sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, roles('admin','superadmin'), async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, roles('admin','superadmin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, roles('superadmin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
