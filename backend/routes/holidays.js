const router = require('express').Router();
const Holiday = require('../models/Holiday');
const { protect, roles } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const isManager = ['manager','admin','superadmin'].includes(req.user.role);
    const q = isManager ? {} : { staff: req.user._id };
    const holidays = await Holiday.find(q).populate('staff','firstName lastName').sort({ createdAt: -1 });
    res.json(holidays);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const from = new Date(req.body.from);
    const to = new Date(req.body.to);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
    const holiday = await Holiday.create({
      ...req.body, staff: req.user._id,
      staffName: req.user.firstName + ' ' + req.user.lastName, days
    });
    req.io.emit('holiday_request', { holiday, staffName: holiday.staffName });
    res.status(201).json(holiday);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/status', protect, roles('manager','admin','superadmin'), async (req, res) => {
  try {
    const h = await Holiday.findByIdAndUpdate(req.params.id, {
      status: req.body.status, reviewedBy: req.user._id, reviewNote: req.body.note
    }, { new: true });
    req.io.emit('holiday_update', { id: h._id, status: h.status, staffId: h.staff });
    res.json(h);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
