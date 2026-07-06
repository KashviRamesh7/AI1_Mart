const router = require('express').Router();
const Query = require('../models/Query');
const { protect, roles } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const isManager = ['manager','admin','superadmin'].includes(req.user.role);
    const q = isManager ? {} : { staff: req.user._id };
    const queries = await Query.find(q).sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const query = await Query.create({
      ...req.body, staff: req.user._id,
      staffName: req.user.firstName + ' ' + req.user.lastName
    });
    req.io.emit('new_query', { query });
    res.status(201).json(query);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, roles('manager','admin','superadmin'), async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(req.params.id, {
      ...req.body, resolvedBy: req.user._id
    }, { new: true });
    req.io.emit('query_update', { id: query._id, status: query.status });
    res.json(query);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
