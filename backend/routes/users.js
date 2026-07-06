const router = require('express').Router();
const User = require('../models/User');
const { protect, roles } = require('../middleware/auth');

router.get('/', protect, roles('admin','superadmin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/toggle', protect, roles('admin','superadmin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ isActive: user.isActive });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/me/address', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
