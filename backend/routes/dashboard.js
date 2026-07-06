const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Holiday = require('../models/Holiday');
const Query = require('../models/Query');
const { protect, roles } = require('../middleware/auth');

router.get('/stats', protect, roles('manager','admin','superadmin'), async (req, res) => {
  try {
    const [orders, products, customers, staff, pendingHolidays, openQueries] = await Promise.all([
      Order.find(),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: { $in: ['staff','manager','admin','superadmin'] } }),
      Holiday.countDocuments({ status: 'pending' }),
      Query.countDocuments({ status: 'open' })
    ]);
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === 'pending').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    res.json({ revenue, totalOrders: orders.length, products, customers, staff, pendingHolidays, openQueries, pending, delivered });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
