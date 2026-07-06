const router = require('express').Router();
const Product = require('../models/Product');
const { protect, roles } = require('../middleware/auth');

// GET all (public) - with subcategory filter
router.get('/', async (req, res) => {
  try {
    const { cat, search, sort, subcategory } = req.query;
    let q = { status: 'active' };
    if (cat && cat !== 'All' && cat !== 'all') q.category = cat;
    if (subcategory) q.subcategory = subcategory;
    if (search) q.$or = [
      { name:        { $regex: search, $options: 'i' } },
      { brand:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { subcategory: { $regex: search, $options: 'i' } },
      { tags:        { $regex: search, $options: 'i' } },
    ];
    let query = Product.find(q);
    if (sort === 'price_asc')  query = query.sort({ salePrice: 1 });
    else if (sort === 'price_desc') query = query.sort({ salePrice: -1 });
    else if (sort === 'rating')     query = query.sort({ rating: -1 });
    else                            query = query.sort({ createdAt: -1 });
    const products = await query.lean();
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all for admin (no status filter)
router.get('/admin/all', protect, roles('admin', 'superadmin'), async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create (superadmin)
router.post('/', protect, roles('superadmin'), async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, createdBy: req.user._id });
    req.io.emit('product_update', { type: 'created', product });
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update (superadmin)
router.put('/:id', protect, roles('superadmin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.io.emit('product_update', { type: 'updated', product });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE (superadmin)
router.delete('/:id', protect, roles('superadmin'), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.io.emit('product_update', { type: 'deleted', id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
